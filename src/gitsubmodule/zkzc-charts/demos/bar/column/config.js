export default async () => {
  const [html, javascript, css] = await Promise.all([
    import('!raw-loader!./index.html'),
    import('!raw-loader!./index.js'),
    import('!raw-loader!../../style.css'),
  ]);

  return {
    javascript:{
      code: javascript,
      transformer: 'javascript',
      visible: true
    },
    html: {
      code: html,
      transformer: 'html',
      visible: true,
    },
    foldBoxes: ['html'],
    css: {
      code: css,
    },
    packages: {
      js: [
        'lib/index.umd.js'
      ],
    },
  };
};
