from __future__ import annotations

import re
from pathlib import Path
from typing import Iterable

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT_DIR = Path(__file__).resolve().parent.parent
SOURCE_PDF = ROOT_DIR / 'client' / 'public' / 'checklist-web-tuwebai.pdf'
OUTPUT_PDF = ROOT_DIR / 'client' / 'public' / 'checklist-web-tuwebai-branded.pdf'

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 40
MARGIN_TOP = 42
MARGIN_BOTTOM = 34

# Branding references from repo:
# - client/src/index.css -> body background: linear-gradient(to bottom, #0a0a0f, #121320)
# - client/src/index.css -> primary gradient: #00CCFF to #9933FF
# - marketing pages -> soft cyan text: #9BE7FF
# - globals / cards -> dark panel shades around #10111a and #12131b
COLOR_BG = HexColor('#0a0a0f')
COLOR_BG_ALT = HexColor('#121320')
COLOR_CARD = HexColor('#10111a')
COLOR_CARD_SOFT = HexColor('#12131b')
COLOR_TEXT = HexColor('#ffffff')
COLOR_TEXT_MUTED = HexColor('#c9d7f2')
COLOR_TEXT_SOFT = HexColor('#9BE7FF')
COLOR_TEXT_DIM = HexColor('#8DA1C7')
COLOR_BORDER = Color(1, 1, 1, alpha=0.10)
COLOR_CYAN = HexColor('#00CCFF')
COLOR_VIOLET = HexColor('#9933FF')
COLOR_PINK = HexColor('#FF4FA3')

CATEGORY_ACCENTS = [
    COLOR_PINK,
    COLOR_CYAN,
    COLOR_VIOLET,
    COLOR_PINK,
    COLOR_CYAN,
    COLOR_VIOLET,
    COLOR_PINK,
]

CATEGORY_TITLES = [
    'Velocidad y performance',
    'Mobile y responsive',
    'Conversión y CTAs',
    'SEO básico',
    'Contenido y mensaje',
    'Técnico y seguridad',
    'Analytics y medición',
]

HOW_TO_STEPS = [
    'Marcá solo lo que hoy realmente está resuelto en tu web.',
    'Completá las 7 categorías para tener una lectura completa.',
    'Contá cuántos checks pudiste marcar al final del recorrido.',
    'Usá la página 9 para interpretar el puntaje y priorizar.',
]

TEXT_FIXUPS = {
    'Checklist Web Gratis - TuWebAI': 'Checklist Web Gratis - TuWebAI',
    '35 puntos para saber si tu web esta lista para vender.': '35 puntos para saber si tu web está lista para vender.',
    'Velocidad y performance': 'Velocidad y performance',
    '1. La web carga en menos de 3 segundos en celular con datos moviles': 'La web carga en menos de 3 segundos en celular con datos móviles',
    '2. Las imagenes estan comprimidas y en formato WebP': 'Las imágenes están comprimidas y en formato WebP',
    '3. No hay scripts de terceros bloqueando el render inicial': 'No hay scripts de terceros bloqueando el render inicial',
    '4. El puntaje de PageSpeed en mobile es mayor a 70': 'El puntaje de PageSpeed en mobile es mayor a 70',
    '5. No hay fuentes externas cargando sin display=swap': 'No hay fuentes externas cargando sin display=swap',
    'Mobile y responsive': 'Mobile y responsive',
    '6. El diseno se ve correctamente en pantallas de 375px de ancho': 'El diseño se ve correctamente en pantallas de 375px de ancho',
    '7. Los botones tienen al menos 44px de area tactil': 'Los botones tienen al menos 44px de área táctil',
    '8. El texto es legible sin necesidad de hacer zoom': 'El texto es legible sin necesidad de hacer zoom',
    '9. Los formularios son usables desde el teclado del celular': 'Los formularios son usables desde el teclado del celular',
    '10. No hay elementos que se superpongan o se corten en mobile': 'No hay elementos que se superpongan o se corten en mobile',
    'Conversion y CTAs': 'Conversión y CTAs',
    '11. Hay un CTA visible sin necesidad de hacer scroll en la home': 'Hay un CTA visible sin necesidad de hacer scroll en la home',
    '12. El CTA dice exactamente que pasa cuando se hace clic': 'El CTA dice exactamente qué pasa cuando se hace clic',
    '13. Hay un numero de WhatsApp o boton de contacto siempre visible': 'Hay un número de WhatsApp o botón de contacto siempre visible',
    '14. El formulario de contacto tiene 5 campos o menos': 'El formulario de contacto tiene 5 campos o menos',
    '15. La pagina de inicio deja claro que hace el negocio en 5 segundos': 'La página de inicio deja claro qué hace el negocio en 5 segundos',
    '16. Cada pagina tiene un titulo unico y descriptivo': 'Cada página tiene un título único y descriptivo',
    '17. Cada pagina tiene una meta description unica': 'Cada página tiene una meta description única',
    '18. El sitio tiene un sitemap.xml enviado a Google Search Console': 'El sitio tiene un sitemap.xml enviado a Google Search Console',
    '19. El sitio esta verificado en Google Search Console': 'El sitio está verificado en Google Search Console',
    '20. Google Business Profile esta completo y verificado': 'Google Business Profile está completo y verificado',
    'Contenido y mensaje': 'Contenido y mensaje',
    '21. La propuesta de valor esta clara en el hero de la home': 'La propuesta de valor está clara en el hero de la home',
    '22. Los servicios tienen descripciones especificas, no genericas': 'Los servicios tienen descripciones específicas, no genéricas',
    '23. Hay al menos 3 testimonios o casos reales visibles': 'Hay al menos 3 testimonios o casos reales visibles',
    '24. Los precios o rangos de precio son accesibles sin tener que consultar': 'Los precios o rangos de precio son accesibles sin tener que consultar',
    '25. El nosotros humaniza la empresa con nombres y fotos reales': 'El nosotros humaniza la empresa con nombres y fotos reales',
    'Tecnico y seguridad': 'Técnico y seguridad',
    '26. El sitio tiene HTTPS activo': 'El sitio tiene HTTPS activo',
    '27. No hay errores 404 en paginas importantes': 'No hay errores 404 en páginas importantes',
    '28. El sitio tiene robots.txt configurado correctamente': 'El sitio tiene robots.txt configurado correctamente',
    '29. Las imagenes tienen texto alternativo': 'Las imágenes tienen texto alternativo',
    '30. El HTML tiene el atributo lang definido correctamente': 'El HTML tiene el atributo lang definido correctamente',
    'Analytics y medicion': 'Analytics y medición',
    '31. Google Analytics o equivalente esta instalado y verificado': 'Google Analytics o equivalente está instalado y verificado',
    '32. Las conversiones estan trackeadas': 'Las conversiones están trackeadas',
    '33. Se revisan las metricas del sitio al menos una vez por mes': 'Se revisan las métricas del sitio al menos una vez por mes',
    '34. Se sabe de donde viene el trafico': 'Se sabe de dónde viene el tráfico',
    '35. Se conoce la tasa de conversion actual': 'Se conoce la tasa de conversión actual',
}


def rl_text(value: str) -> str:
    return value.encode('latin-1', 'replace').decode('latin-1')


def draw_gradient_line(pdf: canvas.Canvas, x: float, y: float, width: float, height: float) -> None:
    steps = max(1, int(width))
    for step in range(steps):
        ratio = step / max(1, steps - 1)
        red = COLOR_PINK.red + (COLOR_CYAN.red - COLOR_PINK.red) * ratio
        green = COLOR_PINK.green + (COLOR_CYAN.green - COLOR_PINK.green) * ratio
        blue = COLOR_PINK.blue + (COLOR_CYAN.blue - COLOR_PINK.blue) * ratio
        pdf.setStrokeColor(Color(red, green, blue, alpha=0.95))
        pdf.setLineWidth(height)
        pdf.line(x + step, y, x + step + 1, y)


def draw_background(pdf: canvas.Canvas) -> None:
    pdf.saveState()
    pdf.setFillColor(COLOR_BG)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    pdf.setFillColor(COLOR_BG_ALT)
    pdf.rect(0, PAGE_HEIGHT * 0.42, PAGE_WIDTH, PAGE_HEIGHT * 0.58, fill=1, stroke=0)

    orbs = [
        (70, PAGE_HEIGHT - 55, 120, COLOR_CYAN, 0.05),
        (PAGE_WIDTH - 90, PAGE_HEIGHT - 100, 150, COLOR_VIOLET, 0.04),
        (PAGE_WIDTH - 65, 95, 135, COLOR_PINK, 0.035),
        (80, 120, 110, COLOR_CYAN, 0.03),
    ]
    for x, y, radius, color, alpha in orbs:
        pdf.setFillColor(Color(color.red, color.green, color.blue, alpha=alpha))
        pdf.circle(x, y, radius, fill=1, stroke=0)

    draw_gradient_line(pdf, MARGIN_X, PAGE_HEIGHT - 24, PAGE_WIDTH - (MARGIN_X * 2), 3)
    draw_gradient_line(pdf, MARGIN_X, 24, PAGE_WIDTH - (MARGIN_X * 2), 3)
    pdf.restoreState()


def draw_logo(pdf: canvas.Canvas, x: float, y: float, small: bool = False) -> None:
    base_font = 18 if small else 24
    accent_font = 18 if small else 24
    pdf.setFont('Helvetica-Bold', base_font)
    pdf.setFillColor(COLOR_TEXT)
    pdf.drawString(x, y, rl_text('TuWeb'))
    offset = stringWidth('TuWeb', 'Helvetica-Bold', base_font) + 1
    pdf.setFillColor(COLOR_PINK)
    pdf.setFont('Helvetica-Bold', accent_font)
    pdf.drawString(x + offset, y, rl_text('.ai'))


def wrap_text(text: str, font_name: str, font_size: int, max_width: float) -> list[str]:
    words = text.split()
    if not words:
        return ['']

    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = f'{current} {word}'
        if stringWidth(rl_text(candidate), font_name, font_size) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def draw_multiline(
    pdf: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    font_name: str,
    font_size: int,
    color: Color,
    max_width: float,
    leading: float,
) -> float:
    pdf.setFillColor(color)
    pdf.setFont(font_name, font_size)
    cursor_y = y
    for line in wrap_text(text, font_name, font_size, max_width):
        pdf.drawString(x, cursor_y, rl_text(line))
        cursor_y -= leading
    return cursor_y


def extract_source_items() -> list[str]:
    raw = SOURCE_PDF.read_bytes()
    strings = re.findall(rb'\((.*?)\)\s*Tj', raw)
    cleaned: list[str] = []
    for item in strings:
        text = item.decode('latin-1', errors='ignore').replace('\\(', '(').replace('\\)', ')').strip()
        if text:
            cleaned.append(text)

    items: list[str] = []
    for text in cleaned:
        if re.match(r'^\d+\.\s', text):
            normalized = TEXT_FIXUPS.get(text, text)
            items.append(re.sub(r'^\d+\.\s*', '', normalized))

    if len(items) != 35:
        raise RuntimeError(f'Se esperaban 35 items en el PDF base y se extrajeron {len(items)}.')

    return items


def chunked(values: list[str], size: int) -> Iterable[list[str]]:
    for index in range(0, len(values), size):
        yield values[index : index + size]


def draw_cover_page(pdf: canvas.Canvas, categories: list[dict[str, object]]) -> None:
    draw_background(pdf)
    draw_logo(pdf, MARGIN_X, PAGE_HEIGHT - MARGIN_TOP, small=False)

    pdf.setFillColor(COLOR_TEXT_SOFT)
    pdf.setFont('Helvetica-Bold', 11)
    pdf.drawString(MARGIN_X, PAGE_HEIGHT - 78, rl_text('RECURSO GRATUITO · TUWEBAI'))

    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 31)
    pdf.drawString(MARGIN_X, PAGE_HEIGHT - 128, rl_text('Checklist Web Gratis'))

    draw_multiline(
        pdf,
        '35 puntos para saber si tu web está lista para vender.',
        MARGIN_X,
        PAGE_HEIGHT - 160,
        'Helvetica',
        15,
        COLOR_TEXT_MUTED,
        360,
        20,
    )

    stats_y = PAGE_HEIGHT - 210
    stats = ['35 puntos', '7 categorías', '10 minutos']
    stat_x = MARGIN_X
    for stat in stats:
        width = stringWidth(rl_text(stat), 'Helvetica-Bold', 12) + 28
        pdf.setFillColor(Color(COLOR_CARD.red, COLOR_CARD.green, COLOR_CARD.blue, alpha=0.92))
        pdf.roundRect(stat_x, stats_y, width, 28, 14, fill=1, stroke=0)
        pdf.setStrokeColor(Color(COLOR_CYAN.red, COLOR_CYAN.green, COLOR_CYAN.blue, alpha=0.28))
        pdf.roundRect(stat_x, stats_y, width, 28, 14, fill=0, stroke=1)
        pdf.setFillColor(COLOR_TEXT)
        pdf.setFont('Helvetica-Bold', 12)
        pdf.drawString(stat_x + 14, stats_y + 9, rl_text(stat))
        stat_x += width + 10

    draw_gradient_line(pdf, MARGIN_X, PAGE_HEIGHT - 238, PAGE_WIDTH - (MARGIN_X * 2), 2)

    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 16)
    pdf.drawString(MARGIN_X, PAGE_HEIGHT - 276, rl_text('Cómo usarlo'))
    for step_index, step in enumerate(HOW_TO_STEPS, start=1):
        box_y = PAGE_HEIGHT - 300 - ((step_index - 1) * 34)
        pdf.setFillColor(Color(COLOR_CARD_SOFT.red, COLOR_CARD_SOFT.green, COLOR_CARD_SOFT.blue, alpha=0.96))
        pdf.roundRect(MARGIN_X, box_y, 515, 24, 10, fill=1, stroke=0)
        pdf.setFillColor(CATEGORY_ACCENTS[(step_index - 1) % len(CATEGORY_ACCENTS)])
        pdf.circle(MARGIN_X + 13, box_y + 12, 7, fill=1, stroke=0)
        pdf.setFillColor(COLOR_BG)
        pdf.setFont('Helvetica-Bold', 8)
        pdf.drawCentredString(MARGIN_X + 13, box_y + 9.2, str(step_index))
        pdf.setFillColor(COLOR_TEXT_MUTED)
        pdf.setFont('Helvetica', 10)
        pdf.drawString(MARGIN_X + 28, box_y + 8, rl_text(step))

    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 16)
    pdf.drawString(MARGIN_X, PAGE_HEIGHT - 460, rl_text('Categorías'))

    grid_x = MARGIN_X
    grid_y = PAGE_HEIGHT - 485
    card_width = 166
    card_height = 44
    for index, category in enumerate(categories):
        row = index // 3
        col = index % 3
        current_x = grid_x + (col * (card_width + 8))
        current_y = grid_y - (row * (card_height + 10))
        accent = category['accent']
        pdf.setFillColor(Color(COLOR_CARD.red, COLOR_CARD.green, COLOR_CARD.blue, alpha=0.96))
        pdf.roundRect(current_x, current_y, card_width, card_height, 12, fill=1, stroke=0)
        pdf.setFillColor(accent)
        pdf.rect(current_x, current_y, 6, card_height, fill=1, stroke=0)
        pdf.setFillColor(Color(accent.red, accent.green, accent.blue, alpha=0.22))
        pdf.roundRect(current_x, current_y, card_width, card_height, 12, fill=0, stroke=1)
        pdf.setFillColor(COLOR_TEXT)
        pdf.setFont('Helvetica-Bold', 10)
        pdf.drawString(current_x + 16, current_y + 26, rl_text(f"{index + 1:02d}"))
        pdf.setFont('Helvetica', 9)
        pdf.drawString(current_x + 16, current_y + 12, rl_text(category['title']))

    cta_y = 94
    pdf.setFillColor(Color(COLOR_CARD_SOFT.red, COLOR_CARD_SOFT.green, COLOR_CARD_SOFT.blue, alpha=0.98))
    pdf.roundRect(MARGIN_X, cta_y, PAGE_WIDTH - (MARGIN_X * 2), 92, 18, fill=1, stroke=0)
    draw_gradient_line(pdf, MARGIN_X + 16, cta_y + 76, PAGE_WIDTH - (MARGIN_X * 2) - 32, 2)
    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 18)
    pdf.drawString(MARGIN_X + 18, cta_y + 50, rl_text('¿Encontraste problemas en tu checklist?'))
    pdf.setFillColor(COLOR_TEXT_MUTED)
    pdf.setFont('Helvetica', 11)
    pdf.drawString(MARGIN_X + 18, cta_y + 30, rl_text('Pedí un diagnóstico gratuito en tuweb-ai.com/diagnostico-gratuito'))
    pdf.drawString(MARGIN_X + 18, cta_y + 14, rl_text('Sin cargo · Sin compromiso · Respondemos en menos de 24 horas'))


def draw_item_card(
    pdf: canvas.Canvas,
    category_index: int,
    item_number: int,
    item_text: str,
    x: float,
    y: float,
    width: float,
    height: float,
) -> None:
    accent = CATEGORY_ACCENTS[category_index]
    pdf.setFillColor(Color(COLOR_CARD_SOFT.red, COLOR_CARD_SOFT.green, COLOR_CARD_SOFT.blue, alpha=0.96))
    pdf.roundRect(x, y, width, height, 16, fill=1, stroke=0)
    pdf.setStrokeColor(Color(accent.red, accent.green, accent.blue, alpha=0.35))
    pdf.roundRect(x, y, width, height, 16, fill=0, stroke=1)
    pdf.setFillColor(accent)
    pdf.roundRect(x, y, 6, height, 16, fill=1, stroke=0)

    pdf.setFillColor(accent)
    pdf.setFont('Helvetica-Bold', 13)
    pdf.drawString(x + 20, y + height - 22, rl_text(f'{item_number:02d}'))

    checkbox_x = x + 52
    checkbox_y = y + height - 28
    checkbox_size = 13
    pdf.setStrokeColor(Color(accent.red, accent.green, accent.blue, alpha=0.9))
    pdf.setLineWidth(1.1)
    pdf.roundRect(checkbox_x, checkbox_y, checkbox_size, checkbox_size, 2.5, fill=0, stroke=1)

    # Checkbox interactivo real del PDF, superpuesto al borde dibujado.
    pdf.acroForm.checkbox(
        name=f'check_{item_number:02d}',
        tooltip=rl_text(item_text),
        x=checkbox_x + 0.7,
        y=checkbox_y + 0.7,
        size=checkbox_size - 1.4,
        checked=False,
        buttonStyle='check',
        borderWidth=0,
        fillColor=None,
        textColor=accent,
        forceBorder=False,
    )

    draw_multiline(
        pdf,
        item_text,
        x + 74,
        y + height - 18,
        'Helvetica',
        11,
        COLOR_TEXT,
        width - 92,
        14,
    )


def draw_category_page(pdf: canvas.Canvas, category_index: int, category_title: str, items: list[str]) -> None:
    draw_background(pdf)
    accent = CATEGORY_ACCENTS[category_index]
    draw_logo(pdf, MARGIN_X, PAGE_HEIGHT - MARGIN_TOP, small=True)

    badge_center_x = MARGIN_X + 18
    badge_center_y = PAGE_HEIGHT - 96
    pdf.setFillColor(accent)
    pdf.circle(badge_center_x, badge_center_y, 18, fill=1, stroke=0)
    pdf.setFillColor(COLOR_BG)
    pdf.setFont('Helvetica-Bold', 14)
    pdf.drawCentredString(badge_center_x, badge_center_y - 5, rl_text(str(category_index + 1)))

    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 24)
    pdf.drawString(MARGIN_X + 44, PAGE_HEIGHT - 104, rl_text(category_title))
    draw_gradient_line(pdf, MARGIN_X + 44, PAGE_HEIGHT - 118, 320, 2)

    card_width = PAGE_WIDTH - (MARGIN_X * 2)
    card_height = 98
    start_y = PAGE_HEIGHT - 220
    item_start = category_index * 5
    for local_index, item_text in enumerate(items):
        item_number = item_start + local_index + 1
        card_y = start_y - (local_index * (card_height + 12))
        draw_item_card(pdf, category_index, item_number, item_text, MARGIN_X, card_y, card_width, card_height)

    range_start = item_start + 1
    range_end = item_start + len(items)
    pdf.setFillColor(COLOR_TEXT_DIM)
    pdf.setFont('Helvetica', 10)
    pdf.drawString(
        MARGIN_X,
        MARGIN_BOTTOM,
        rl_text(f'Categoría {category_index + 1} de 7 · TuWebAI · tuweb-ai.com'),
    )
    pdf.drawRightString(
        PAGE_WIDTH - MARGIN_X,
        MARGIN_BOTTOM,
        rl_text(f'Puntos {range_start}-{range_end} de 35'),
    )


def draw_result_card(
    pdf: canvas.Canvas,
    title: str,
    description: str,
    cta: str,
    accent: Color,
    x: float,
    y: float,
    width: float,
    height: float,
) -> None:
    pdf.setFillColor(Color(COLOR_CARD_SOFT.red, COLOR_CARD_SOFT.green, COLOR_CARD_SOFT.blue, alpha=0.97))
    pdf.roundRect(x, y, width, height, 18, fill=1, stroke=0)
    pdf.setStrokeColor(Color(accent.red, accent.green, accent.blue, alpha=0.45))
    pdf.roundRect(x, y, width, height, 18, fill=0, stroke=1)
    pdf.setFillColor(accent)
    pdf.rect(x, y, 7, height, fill=1, stroke=0)

    pdf.setFillColor(accent)
    pdf.setFont('Helvetica-Bold', 14)
    pdf.drawString(x + 18, y + height - 24, rl_text(title))
    draw_multiline(pdf, description, x + 18, y + height - 48, 'Helvetica', 11, COLOR_TEXT, width - 36, 15)
    pdf.setFillColor(COLOR_TEXT_SOFT)
    pdf.setFont('Helvetica-Bold', 10)
    pdf.drawString(x + 18, y + 16, rl_text(cta))


def draw_results_page(pdf: canvas.Canvas) -> None:
    draw_background(pdf)
    draw_logo(pdf, MARGIN_X, PAGE_HEIGHT - MARGIN_TOP, small=True)

    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 27)
    pdf.drawString(MARGIN_X, PAGE_HEIGHT - 104, rl_text('¿Cuántos puntos pudiste marcar?'))

    draw_multiline(
        pdf,
        'Sumá tus checks interactivos y usá esta guía para interpretar el puntaje final.',
        MARGIN_X,
        PAGE_HEIGHT - 134,
        'Helvetica',
        12,
        COLOR_TEXT_MUTED,
        460,
        16,
    )

    draw_result_card(
        pdf,
        '0 a 12 · Crítico',
        'Tu web tiene problemas críticos que están frenando tus consultas.',
        'Pedí el diagnóstico gratuito.',
        COLOR_PINK,
        MARGIN_X,
        PAGE_HEIGHT - 290,
        PAGE_WIDTH - (MARGIN_X * 2),
        92,
    )
    draw_result_card(
        pdf,
        '13 a 24 · Mejora clara',
        'Hay oportunidades claras de mejora.',
        'Hablemos de cómo optimizarla.',
        COLOR_VIOLET,
        MARGIN_X,
        PAGE_HEIGHT - 402,
        PAGE_WIDTH - (MARGIN_X * 2),
        92,
    )
    draw_result_card(
        pdf,
        '25 a 35 · Base sólida',
        'Tu web está bien optimizada.',
        'Si igual no convertís, hablemos.',
        COLOR_CYAN,
        MARGIN_X,
        PAGE_HEIGHT - 514,
        PAGE_WIDTH - (MARGIN_X * 2),
        92,
    )

    draw_gradient_line(pdf, MARGIN_X, 240, PAGE_WIDTH - (MARGIN_X * 2), 2)
    pdf.setFillColor(COLOR_TEXT)
    pdf.setFont('Helvetica-Bold', 18)
    pdf.drawString(MARGIN_X, 208, rl_text('Diagnóstico gratuito: tuweb-ai.com/diagnostico-gratuito'))
    pdf.setFillColor(COLOR_TEXT_MUTED)
    pdf.setFont('Helvetica', 11)
    pdf.drawString(MARGIN_X, 184, rl_text('Sin cargo · Sin compromiso · Respondemos en menos de 24 horas'))

    pdf.setFillColor(COLOR_TEXT_DIM)
    pdf.setFont('Helvetica', 10)
    pdf.drawString(
        MARGIN_X,
        MARGIN_BOTTOM,
        rl_text('© 2026 TuWebAI · Desarrollo web profesional · tuweb-ai.com'),
    )


def build_pdf() -> None:
    items = extract_source_items()
    category_items = list(chunked(items, 5))
    categories = [
        {'title': title, 'accent': CATEGORY_ACCENTS[index], 'items': category_items[index]}
        for index, title in enumerate(CATEGORY_TITLES)
    ]

    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=A4)
    pdf.setTitle(rl_text('Checklist Web Gratis - TuWebAI'))
    pdf.setAuthor(rl_text('TuWebAI'))
    pdf.setSubject(rl_text('Checklist web branded e interactivo'))
    pdf.setCreator(rl_text('scripts/generate-checklist-web-gratis-pdf.py'))

    draw_cover_page(pdf, categories)
    pdf.showPage()

    for index, category in enumerate(categories):
        draw_category_page(pdf, index, category['title'], category['items'])
        pdf.showPage()

    draw_results_page(pdf)
    pdf.save()


def verify_output() -> None:
    data = OUTPUT_PDF.read_bytes()
    page_count = len(re.findall(rb'/Type\s*/Page\b', data))
    if page_count != 9:
        raise RuntimeError(f'Se esperaban 9 páginas y el PDF generado tiene {page_count}.')

    checkbox_count = len(re.findall(rb'/FT\s*/Btn', data))
    if checkbox_count < 35:
        raise RuntimeError(f'Se esperaban al menos 35 campos interactivos y se detectaron {checkbox_count}.')


if __name__ == '__main__':
    build_pdf()
    verify_output()
    print(f'OK: {OUTPUT_PDF}')
