import Typography from 'typography';
import githubTheme from 'typography-theme-github';

const theme = {
    googleFonts: [
        {
            name: 'Roboto',
            styles: ['100', '300', '400', '500', '700']
        }
    ],
    scale: 4.2,
    baseFontSize: '14.5px',
    baseLineHeight: 1.5,
    headerFontFamily: ['Roboto', 'sans-serif'],
    bodyFontFamily: ['Roboto', 'sans-serif']
};

const typography = new Typography(theme);

export default typography;
