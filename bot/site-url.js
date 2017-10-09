var siteUrl = null;

module.exports = {
    save: function(url) {
        siteUrl = url;
    },
    getUrl: function() {
        return siteUrl;
    }
}