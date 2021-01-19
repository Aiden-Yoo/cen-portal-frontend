module.exports = {
  client: {
    includes: ['./src/**/*.tsx'],
    tagName: 'gql',
    service: {
      name: 'cen-portal-backend',
      url: 'http://localhost:4000/graphql',
    },
  },
};
