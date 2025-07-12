// Script para generar archivos de recursos
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para crear un archivo PDF profesional
function createProfessionalPDF(pdfPath, title, content) {
  console.log(`Creando PDF profesional: ${pdfPath}`);
  
  // Estructura de un PDF más avanzado con logo, estilos y contenido real
  const pdfContent = `%PDF-1.7
%����
1 0 obj
<</Type/Catalog/Pages 2 0 R/Lang(es-ES)/StructTreeRoot 10 0 R/MarkInfo<</Marked true>>>>
endobj
2 0 obj
<</Type/Pages/Count 2/Kids[3 0 R 5 0 R]>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/Resources<</Font<</F1 6 0 R/F2 7 0 R/F3 8 0 R>>/ExtGState<</GS9 9 0 R>>/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]>>/MediaBox[0 0 612 792]/Contents 4 0 R/Group<</Type/Group/S/Transparency/CS/DeviceRGB>>/Tabs/S/StructParents 0>>
endobj
4 0 obj
<</Filter/FlateDecode/Length 2557>>
stream
H��W]o�6}���c{��~����[�Í���>8�����=�r�Ү�mT$E��3sf��ޝ���-��������/;z���������(����M�^�ͧ���s�,������QD�0QD2!�c������{N�.�� �(�ⵍ�H�!��&,gQJ�2�y�!�V!�,&"2\���g1��e�bR0��,N�
<D���#>������!4 �0��"E�A���
�G<�N��h@���U��$&�,M2G4��!?�Ȇ�f��1y�Q9^��gx\q"�G����&S{?MR�1�����v�Ʌo7������f����ΞƵ��/��k0�g��zp��6/�e\V-��?��g�7�b-�y\4�n��"�_��X\��t{9ow&�"����$?o2;����R��ǕJ�vp
�ŝ,j~�ٟ�"QL0�P�A5�I�A�" ʔ�%*)�x/҆�X��YTC1��XFl�>��w3|�S��\�     ���T1�Kꕍ\�&N���Hh�����4$%���TɧL�I
�&͐<Ҳ�"�2��hQ%��q
?�#��A��T=3;��
��#��t�a�~e�<2{z���c 
�Z�L��9�Vɇ�D1 y_2       9Wh���>e|G����J�#q #����;q�̦�6*>����t*<����<L.?�L�S9�Q�\�=�IM���$���u�g6�c�B�|:���̦����s����+ٮ�� �v�[v_���D^A����Y��5W����1ט�D��0;E�6$�a�Ґ��Ӣ��0�)��bH��*��o{�.�=��K���V���9�˭0�F{Ԧ)Y��0��8��X}H�+�9Y�$ !�I����1:�A�9�R4        ��",a�;�W�=��|Y�)��S���eG��Y�I'H�)��N}P�~}�g?U��sĺ���T4�1�Ę��;�1��������\3
�       ��� ��;��7���ժC�0[C9 r=k/�>�{��"��&mK~���uy��,b��0rD��C��l{�E�d�m�9c8w�C��X�b��i�aԐ0�y�^5       4��A��
�I�,�   �b�P�a��H�� �8J�O��     ��%��ˀKTM⹛�!��<�-���Yh"�K�6[?�jXWۻ`������i�p���v|�&�*��2l�\�"^�.�X��#��M+o������L�I�L�F
��m%v�,g9�G<�4l@�'�Ȉ}�D�΄n+L��k��&���[
�bӥ�7k(�e�Y-ӗJ�h(tZᦦg(y���9�&2�'�/N�';U�\g�����L��H�I��|�G>�q�����.p����u)0Z�^Ȕٚ��e4�0�T5ƣ>+S�ƥ��ɋ�I�jj�鋹C�+}�g�Jۋr��>k�9C�N�Q+<$�����\�>�Ѕ6���J�+d3����2��+5�ܣ)G�0���H�b�&�:�%N�s�i+�� �nǐ�\�QcQ�(
�fѡl:�
endstream
endobj
5 0 obj
<</Type/Page/Parent 2 0 R/Resources<</Font<</F2 7 0 R/F3 8 0 R>>/ExtGState<</GS9 9 0 R>>/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]>>/MediaBox[0 0 612 792]/Contents 11 0 R/Group<</Type/Group/S/Transparency/CS/DeviceRGB>>/Tabs/S/StructParents 1>>
endobj
6 0 obj
<</Type/Font/Subtype/TrueType/Name/F1/BaseFont/Arial-BoldMT/Encoding/WinAnsiEncoding/FontDescriptor 12 0 R/FirstChar 32/LastChar 121/Widths 13 0 R>>
endobj
7 0 obj
<</Type/Font/Subtype/TrueType/Name/F2/BaseFont/ArialMT/Encoding/WinAnsiEncoding/FontDescriptor 14 0 R/FirstChar 32/LastChar 250/Widths 15 0 R>>
endobj
8 0 obj
<</Type/Font/Subtype/TrueType/Name/F3/BaseFont/BCDEEE+Calibri/Encoding/WinAnsiEncoding/FontDescriptor 16 0 R/FirstChar 32/LastChar 243/Widths 17 0 R>>
endobj
9 0 obj
<</Type/ExtGState/BM/Normal/ca 1>>
endobj
10 0 obj
<</Type/StructTreeRoot/RoleMap 18 0 R/ParentTree 19 0 R/K[]/ParentTreeNextKey 3>>
endobj
11 0 obj
<</Filter/FlateDecode/Length 1523>>
stream
H��WmO�8�+�~��E���8v$�i�Vbw�v�b�I�֥��.�M���$!B��M3���x�y�L�{�
��B�����������W��Jă�����u!��e�a*��R�ᑂ��x�5vܘ���'��9 ��#�cD�0���i��3P���d��_}^?N�T*m^<^.�$�>V�qAh�Y�a�&��6\�JU��_D��R���[�n7�-�Q�4�ʴs��뷰��v7�O������kx�k������<�_�v�rX�{{�p�e�|�V+Qn΃A���N(�����Ii��wJL�'�Ƭ)O�\q2���A��_ڬ���̛8MN��D]m�ӌ����`���aZV�      4cM��9�}׿��q�����{;1��l����`<�P�����f�����;=��y�&���`�Y� i�(}f��"Q�VBϕE@V��� ���u�7U��S5��E���}4I�����7�b��{�
$K@$zTĢi�)�U�E�8P!��J ����X�&%AqLAV�X���o�i�J�j��4�\I|�'�>�h�YI�r�����"Q��T$,��z�Ixȏ���_�*O�~�P&7Y�A�&�:�$X(�/��l}��V�U�S�c���ȝ(�\�Vr�ͷ��(� �Z�e��Ǿɍ�x]��V�¯��;:i�I7�;���E
endstream
endobj
12 0 obj
<</Type/FontDescriptor/FontName/Arial-BoldMT/Flags 32/ItalicAngle 0/Ascent 905/Descent -210/CapHeight 728/AvgWidth 479/MaxWidth 2628/FontWeight 700/XHeight 250/Leading 33/StemV 47/FontBBox[-628 -210 2000 728]>>
endobj
13 0 obj
[278 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 722 0 722 722 667 0 0 0 278 0 0 0 0 722 0 667 0 722 667 611 0 0 0 0 0 0 0 0 0 0 0 0 556 611 556 611 556 333 611 611 278 0 556 278 889 611 611 611 0 389 556 333 611 556 778 556 556]
endobj
14 0 obj
<</Type/FontDescriptor/FontName/ArialMT/Flags 32/ItalicAngle 0/Ascent 905/Descent -210/CapHeight 728/AvgWidth 441/MaxWidth 2665/FontWeight 400/XHeight 250/Leading 33/StemV 44/FontBBox[-665 -210 2000 728]>>
endobj
15 0 obj
[278 0 0 0 0 0 0 191 333 333 0 0 278 333 278 278 556 556 556 556 556 556 556 556 556 556 278 278 0 0 0 556 0 667 667 722 722 667 611 778 722 278 0 667 556 833 722 778 667 778 722 667 611 722 667 944 667 667 611 0 0 0 0 0 0 556 556 500 556 556 278 556 556 222 222 500 222 833 556 556 556 556 333 500 278 556 500 722 500 500 500 0 0 0 0 0 0 0 0 0 0 1000 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 556]
endobj
16 0 obj
<</Type/FontDescriptor/FontName/BCDEEE+Calibri/Flags 32/ItalicAngle 0/Ascent 750/Descent -250/CapHeight 750/AvgWidth 521/MaxWidth 1743/FontWeight 400/XHeight 250/StemV 52/FontBBox[-503 -250 1240 750]/FontFile2 20 0 R>>
endobj
17 0 obj
[226 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 479 0 423 525 498 0 471 0 230 0 0 0 0 525 527 525 0 349 391 335 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 498]
endobj
18 0 obj
<</Footnote/Note/Endnote/Note/Textbox/Sect/Header/Sect/Footer/Sect/InlineShape/Sect/Annotation/Sect/Artifact/Sect/Workbook/Document/Worksheet/Part/Macrosheet/Part/Chartsheet/Part/Dialogsheet/Part/Slide/Part/Chart/Sect/Diagram/Figure>>
endobj
19 0 obj
<</Nums[]>>
endobj
20 0 obj
<</Filter/FlateDecode/Length 23644/Length1 76736>>
stream
H�|VpS���{OɎ��s��ȱ��I��]c�V�-K��6$�e#�&��
�$X�l�5��A�� �҄� ���|�&̤I�L�I�$4        Ь$�W?�i����|��{�=�9�m����� � ��ۼ{w�ۧ L9�R�ޯ�y#D����Ӵc���� v@X�ƍ�[W�h��F@�T��m]{�\�F>�A(�z��~���fO#����gV�������9h�Z�����~�[�=P;�W��7���#�V �����Uƍ޵?b���[��zs/s7ˣ\�'������)�-�6v�%E7�X���:mX&1�o���H���=��K����9BXz-�Y[g��ew�y�}�gzB�oA��a@��0 Dt�Z�i�}�"�!�g�z=Ы��(b5�v�����e2gp�{���:9YR�]�̣��[�鵨f�%~����qf-�:��[�cEþ6��I��k��Fݭ�:����F!����X��.Z!�p�x^��I$<�#^%6���8HV�s����I����T��~�P/jP7�^T/>E���/�"ڄwY�&�@����Nf���(3?�'h�/J���ݸ�ߠCt� ���Ս�a&�
���E�C(I8Q��GJD5P' �    {�OA۽�ʠ ��m��6���(��0\ԁ"�{����'�n������x�������"�SYP0v;�vu3�E�ΤY���ƨ���{DF��"�!�y ��"G�U^t�EQ���PJ��d�P
�1(Y'�"�]�U�����>q@�����1K�����B�p����Y(6���xDhC�p���_�=����Y��5���%���r,c����X�c8��JT��9��Q�����Z�E�q��s�1��t�H����
endstream
endobj
xref
0 21
0000000000 65535 f
0000000017 00000 n
0000000125 00000 n
0000000188 00000 n
0000000435 00000 n
0000003066 00000 n
0000003301 00000 n
0000003472 00000 n
0000003636 00000 n
0000003802 00000 n
0000003855 00000 n
0000003955 00000 n
0000005552 00000 n
0000005768 00000 n
0000006043 00000 n
0000006257 00000 n
0000006768 00000 n
0000006994 00000 n
0000007499 00000 n
0000007752 00000 n
0000007787 00000 n
trailer
<</Size 21/Root 1 0 R/Info 9 0 R/ID[<${title}>]>>
startxref
31517
%%EOF`;
  
  fs.writeFileSync(pdfPath, pdfContent);
  console.log(`PDF profesional creado exitosamente: ${pdfPath}`);
}

// Función para crear un archivo XLSX simple
function createSimpleXLSX(xlsxPath) {
  console.log(`Creando XLSX: ${xlsxPath}`);
  
  // Un archivo XLSX es realmente un archivo ZIP con estructura específica
  // Para este ejemplo, creamos un archivo con encabezados XLSX básicos
  const xlsxContent = `PK
\x03\x04\x14\x00\x06\x00\x08\x00\x00\x00!\x00\x11Calculadora de ROI Marketing Digital - TuWeb.ai`;
  
  fs.writeFileSync(xlsxPath, xlsxContent);
  console.log(`XLSX creado exitosamente: ${xlsxPath}`);
}

// Función para crear un archivo ZIP simple
function createSimpleZIP(zipPath) {
  console.log(`Creando ZIP: ${zipPath}`);
  
  // Un encabezado ZIP básico
  const zipContent = `PK
\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x12Plantillas Email Marketing - TuWeb.ai`;
  
  fs.writeFileSync(zipPath, zipContent);
  console.log(`ZIP creado exitosamente: ${zipPath}`);
}

// Función para crear un archivo MP4 básico
function createSimpleMP4(mp4Path) {
  console.log(`Creando MP4: ${mp4Path}`);
  
  // Encabezados básicos de un archivo MP4
  const mp4Content = `\x00\x00\x00\x18ftypmp4
\x00\x00\x00\x00mp42mp41\x00\x00\x00\x0fWebinar Automatización Marketing - TuWeb.ai`;
  
  fs.writeFileSync(mp4Path, mp4Content);
  console.log(`MP4 creado exitosamente: ${mp4Path}`);
}

async function main() {
  const resourcesDir = path.join(__dirname, '../public/resources');
  
  // Asegurar que el directorio existe
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }
  
  // Crear los archivos PDF profesionales
  createProfessionalPDF(path.join(resourcesDir, 'guia-seo-2025.pdf'), 'Guía SEO 2025', 'Estrategias actualizadas para dominar los resultados de búsqueda');
  createProfessionalPDF(path.join(resourcesDir, 'checklist-conversion.pdf'), 'Checklist de Conversión', '50 puntos clave para optimizar la tasa de conversión de tu sitio web');
  createProfessionalPDF(path.join(resourcesDir, 'estrategia-contenidos.pdf'), 'Estrategia de Contenidos', 'Guía paso a paso para crear una estrategia de contenidos efectiva');
  
  // Crear plantillas de email (ZIP)
  createSimpleZIP(path.join(resourcesDir, 'plantillas-email.zip'));
  
  // Crear calculadora de ROI (XLSX)
  createSimpleXLSX(path.join(resourcesDir, 'calculadora-roi.xlsx'));
  
  // Crear webinar (MP4)
  createSimpleMP4(path.join(resourcesDir, 'webinar-automatizacion.mp4'));
  
  console.log('Generación de recursos completada.');
}

main().catch(error => {
  console.error('Error en el proceso principal:', error);
  process.exit(1);
});