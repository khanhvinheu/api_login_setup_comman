const path = require('path');
module.exports = {
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': path.join(__dirname, '/resources/js'),
        },
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },

}

