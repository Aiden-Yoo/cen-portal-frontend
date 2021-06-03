module.exports = {
  client: {
    includes: ['./src/**/*.tsx'],
    tagName: 'gql',
    service: {
      name: 'cen-portal-backend',
      url: 'http://192.168.45.21:4000/graphql',
    },
  },
};
