import { spawn } from 'node:child_process';
import process from 'node:process';

const PORT = process.env.SMOKE_PORT ?? process.env.PORT ?? '5077';
const BASE_URL = process.env.SMOKE_BASE_URL ?? `http://localhost:${PORT}`;
const ORIGIN = process.env.SMOKE_ORIGIN ?? 'http://localhost:5173';
const NO_SPAWN = process.env.SMOKE_NO_SPAWN === '1';
const ENFORCE_AUTH_MODE = process.env.SMOKE_ENFORCE_SERVER_AUTH === '1';
const USE_REAL_SMTP = process.env.SMOKE_USE_REAL_SMTP === '1';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async (path, init = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    signal: AbortSignal.timeout(15000),
    headers: {
      Origin: ORIGIN,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const data = await toJson(response);
  return { response, data };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const assertProtectedReadOrOk = (status) => {
  assert([200, 404, 503].includes(status), `Expected 200/404/503, got ${status}`);
};

const run = async () => {
  const backendSpawn = {
    command: process.execPath,
    args: ['--import', 'tsx', 'server/index.ts'],
  };
  const server = NO_SPAWN
    ? null
    : spawn(
        backendSpawn.command,
        backendSpawn.args,
        {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV || 'development',
          PORT,
          SESSION_SECRET: process.env.SESSION_SECRET || 'smoke-session-secret-123456',
          ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || ORIGIN,
          DISABLE_SMTP_DELIVERY: USE_REAL_SMTP ? (process.env.DISABLE_SMTP_DELIVERY || 'false') : 'true',
          ENFORCE_SERVER_AUTH: ENFORCE_AUTH_MODE ? 'true' : (process.env.ENFORCE_SERVER_AUTH || 'false'),
        },
      }
      );

  if (server) {
    server.stdout.on('data', (chunk) => {
      process.stdout.write(`[smoke:server] ${chunk}`);
    });
    server.stderr.on('data', (chunk) => {
      process.stderr.write(`[smoke:server] ${chunk}`);
    });
  }

  try {
    // Wait for server boot.
    let healthy = false;
    for (let i = 0; i < 25; i += 1) {
      await sleep(1000);
      try {
        const health = await fetch(`${BASE_URL}/api/health`, {
          signal: AbortSignal.timeout(4000),
        });
        if (health.ok) {
          healthy = true;
          break;
        }
      } catch {
        // Continue polling.
      }
    }
    assert(healthy, 'Backend did not become healthy in time');

    const outcomes = [];
    const runCase = async (name, fn) => {
      try {
        await fn();
        outcomes.push({ name, status: 'pass' });
      } catch (error) {
        outcomes.push({ name, status: 'fail', error: error.message });
      }
    };

    await runCase('payment.invalid_plan.400', async () => {
      const { response, data } = await request('/crear-preferencia', {
        method: 'POST',
        body: JSON.stringify({ plan: 'invalid' }),
      });
      assert(response.status === 400, `Expected 400, got ${response.status}`);
      assert(data?.error, 'Expected validation error payload');
    });

    await runCase('cors.preflight.put.users.allowed', async () => {
      const response = await fetch(`${BASE_URL}/api/users/smoke-user-1`, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(10000),
        headers: {
          Origin: ORIGIN,
          'Access-Control-Request-Method': 'PUT',
          'Access-Control-Request-Headers': 'content-type',
        },
      });
      assert(response.ok, `Expected preflight 2xx, got ${response.status}`);
      const allowMethods = response.headers.get('access-control-allow-methods') || '';
      assert(allowMethods.toUpperCase().includes('PUT'), `Expected PUT in allow-methods, got "${allowMethods}"`);
    });

    await runCase('contact.valid.accepted', async () => {
      const { response, data } = await request('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Smoke QA',
          email: 'qa@example.com',
          message: 'Mensaje de smoke test con longitud suficiente.',
        }),
      });
      assert([200, 202].includes(response.status), `Expected 200/202, got ${response.status}`);
      assert(data?.success === true, 'Expected success=true');
    });

    await runCase('consulta.valid.accepted', async () => {
      const { response, data } = await request('/consulta', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Smoke QA',
          email: 'qa@example.com',
          title: 'Consulta smoke',
          message: 'Mensaje de consulta smoke con longitud suficiente.',
        }),
      });
      assert([200, 202].includes(response.status), `Expected 200/202, got ${response.status}`);
      assert(data?.success === true, 'Expected success=true');
    });

    await runCase('propuesta.valid.accepted', async () => {
      const { response, data } = await request('/api/propuesta', {
        method: 'POST',
        body: JSON.stringify({
          nombre: 'Smoke QA',
          email: 'qa@example.com',
          tipo_proyecto: 'web',
          servicios: 'Diseno web',
          presupuesto: '5k-10k',
          plazo: '1_mes',
          detalles: 'Detalles de smoke test suficientemente largos.',
        }),
      });
      assert([200, 202].includes(response.status), `Expected 200/202, got ${response.status}`);
      assert(data?.success === true, 'Expected success=true');
    });

    await runCase('newsletter.valid.accepted_or_email_unavailable', async () => {
      const { response, data } = await request('/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'qa@example.com',
          source: 'smoke-suite',
        }),
      });
      assert([200, 202, 500].includes(response.status), `Expected 200/202/500, got ${response.status}`);
      if (response.status !== 500) {
        assert(data?.success === true, 'Expected success=true');
      }
    });

    await runCase('checklist_web_gratis.valid.accepted', async () => {
      const { response, data } = await request('/newsletter/resources/checklist-web-gratis', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Smoke QA',
          email: 'qa@example.com',
          source: 'smoke-suite',
        }),
      });
      assert([200, 202].includes(response.status), `Expected 200/202, got ${response.status}`);
      assert(data?.success === true, 'Expected success=true');
    });

    await runCase('testimonials.valid.created', async () => {
      const { response, data } = await request('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Smoke QA',
          company: 'QA Inc',
          testimonial: 'Testimonio de smoke test con largo suficiente para validar flujo.',
        }),
      });
      assert(response.status === 201, `Expected 201, got ${response.status}`);
      assert(data?.success === true, 'Expected success=true');
    });

    await runCase('applications.valid.created', async () => {
      const { response, data } = await request('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Smoke QA',
          email: 'qa@example.com',
          phone: '123',
          experience: '3 anos',
          portfolio: 'https://example.com',
          message: 'Mensaje de aplicacion smoke.',
          position: 'Dev',
          department: 'Engineering',
          type: 'Full-time',
        }),
      });
      assert(response.status === 201, `Expected 201, got ${response.status}`);
      assert(data?.success === true, 'Expected success=true');
    });

    await runCase('newsletter.invalid.400', async () => {
      const { response } = await request('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: 'bad-email' }),
      });
      assert(response.status === 400, `Expected 400, got ${response.status}`);
    });

    await runCase('checklist_web_gratis.invalid.400', async () => {
      const { response } = await request('/newsletter/resources/checklist-web-gratis', {
        method: 'POST',
        body: JSON.stringify({ name: 'A', email: 'bad-email' }),
      });
      assert(response.status === 400, `Expected 400, got ${response.status}`);
    });

    await runCase('brevo.webhook.unauthorized_or_accepted', async () => {
      const { response } = await request('/webhooks/brevo', {
        method: 'POST',
        body: JSON.stringify({
          event: 'hard_bounce',
          email: 'qa@example.com',
        }),
      });
      assert([200, 202, 401, 404, 503].includes(response.status), `Expected 200/202/401/404/503, got ${response.status}`);
    });

    if (process.env.BREVO_WEBHOOK_TOKEN) {
      await runCase('brevo.webhook.authorized_or_storage_unavailable', async () => {
        const { response } = await request(`/webhooks/brevo?token=${encodeURIComponent(process.env.BREVO_WEBHOOK_TOKEN)}`, {
          method: 'POST',
          body: JSON.stringify({
            event: 'hard_bounce',
            email: 'qa@example.com',
          }),
        });
        assert([200, 202, 404, 503].includes(response.status), `Expected 200/202/404/503, got ${response.status}`);
      });
    }

    if (ENFORCE_AUTH_MODE) {
      await runCase('users.get.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('users.preferences.get.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/preferences');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('users.privacy.get.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/privacy');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('users.privacy.put.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/privacy', {
          method: 'PUT',
          body: JSON.stringify({
            profileEmailVisible: false,
          }),
        });
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('users.project.get.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/project');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('users.payments.get.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/payments');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('users.tickets.get.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/tickets');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('tickets.by_id.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/tickets/smoke-ticket-1');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('projects.list.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/projects');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('tickets.list.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/tickets');
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('projects.update.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/projects/smoke-project-1', {
          method: 'PUT',
          body: JSON.stringify({
            status: 'active',
          }),
        });
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('tickets.update.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/tickets/smoke-ticket-1', {
          method: 'PUT',
          body: JSON.stringify({
            status: 'resolved',
          }),
        });
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });

      await runCase('tickets.responses.401_without_token_when_auth_enforced', async () => {
        const { response } = await request('/api/users/smoke-user-1/tickets/smoke-ticket-1/responses', {
          method: 'POST',
          body: JSON.stringify({
            message: 'respuesta smoke',
            author: 'smoke',
            authorType: 'client',
          }),
        });
        assert(response.status === 401, `Expected 401, got ${response.status}`);
      });
    } else {
      await runCase('users.get.null_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('users.preferences.get_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1/preferences');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('users.privacy.get_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1/privacy');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('users.privacy.put_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1/privacy', {
          method: 'PUT',
          body: JSON.stringify({
            profileEmailVisible: false,
            profileStatusVisible: false,
          }),
        });
        assert([200, 500, 503].includes(response.status), `Expected 200/500/503, got ${response.status}`);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('users.project.get_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1/project');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('users.payments.get_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1/payments');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('users.tickets.get_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/users/smoke-user-1/tickets');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });
    }

    if (!ENFORCE_AUTH_MODE) {
      await runCase('projects.list_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/projects');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });

      await runCase('tickets.list_or_storage_unavailable', async () => {
        const { response, data } = await request('/api/tickets');
        assertProtectedReadOrOk(response.status);
        if (response.status === 200) assert(data?.success === true, 'Expected success=true');
      });
    }

    await runCase('testimonials.list_or_storage_unavailable', async () => {
      const { response, data } = await request('/api/testimonials');
      assertProtectedReadOrOk(response.status);
      if (response.status === 200) assert(data?.success === true, 'Expected success=true');
    });

    await runCase('testimonials.by_id_or_storage_unavailable', async () => {
      const { response } = await request('/api/testimonials/00000000-0000-0000-0000-000000000000');
      assert([200, 404, 503].includes(response.status), `Expected 200/404/503, got ${response.status}`);
    });

    const failed = outcomes.filter((o) => o.status === 'fail');
    outcomes.forEach((o) => {
      if (o.status === 'pass') {
        console.log(`[smoke] PASS ${o.name}`);
      } else {
        console.error(`[smoke] FAIL ${o.name} -> ${o.error}`);
      }
    });

    if (failed.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (server) {
      server.kill('SIGTERM');
      await sleep(500);
    }
  }
};

run().catch((error) => {
  console.error(`[smoke] fatal: ${error.message}`);
  process.exit(1);
});
