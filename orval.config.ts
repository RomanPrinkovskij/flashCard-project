export default {
    swaggerLocal: {
      input: 'http://localhost:9100/swagger-bucket/swagger/swagger.json',
      output: {
        target: 'api/generated/',
        client: 'vue-query',
        mode: 'tags-split',
        override: {
          mutator: 'api/fetchWithAuth.ts',
        },
      },
    },
  }
  