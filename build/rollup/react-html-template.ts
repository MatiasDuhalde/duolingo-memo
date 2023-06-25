import { type RollupHtmlTemplateOptions, makeHtmlAttributes } from '@rollup/plugin-html';

export const reactHtmlTemplate = (options?: RollupHtmlTemplateOptions) => {
  const { attributes, files, meta, publicPath, title } = options ?? {};

  const scriptAttributes = attributes?.script ? makeHtmlAttributes(attributes.script) : '';
  const linkAttributes = attributes?.link ? makeHtmlAttributes(attributes.link) : '';
  const htmlAttributes = attributes?.html ? makeHtmlAttributes(attributes.html) : '';

  const scripts = (files?.js ?? [])
    .map(({ fileName }) => {
      return `<script src="${publicPath}${fileName}"${scriptAttributes}></script>`;
    })
    .join('\n');

  const links = (files?.css ?? [])
    .map(({ fileName }) => {
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${linkAttributes}>`;
    })
    .join('\n');

  const metas = (meta ?? [])
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
  <html ${htmlAttributes}>
    <head>
      ${metas}
      <title>${title}</title>
      ${links}
    </head>
    <body>
      <div id="root"></div>
      ${scripts}
    </body>
  </html>`;
};
