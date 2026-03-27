module.exports = {
  // REST API
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
  },

  // Vaadin web component bundle + WebSocket
  '/web-component': {
    target: 'http://localhost:8080',
    secure: false,
    ws: true,
  },

  // Vaadin static assets (fonts, client JS, etc.)
  '/VAADIN': {
    target: 'http://localhost:8080',
    secure: false,
  },

  // Vaadin session traffic at the root path.
  //
  // With serviceUrl "//localhost:4200/" and alwaysXhrToServer: true, the
  // Vaadin client POSTs to /?v-r=uidl, /?v-r=heartbeat, etc.
  // These need to reach the Spring Boot backend, but Angular's dev server
  // is at the same origin and intercepts them first.
  //
  // A bypass function lets us route by query string, which plain JSON config
  // cannot express: forward Vaadin requests to :8080, serve everything else
  // (Angular assets, routes) from the local dev server.
  '/': {
    target: 'http://localhost:8080',
    secure: false,
    bypass: function (req) {
      const url = req.url || '';
      if (url.includes('v-r=')) {
        return null; // null → proxy to backend
      }
      return url; // any string → serve locally from Angular dev server
    },
  },
};
