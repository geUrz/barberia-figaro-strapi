module.exports = () => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          accessKeyId: 'AKIA5Z6VK2MAX76PPBPM',
          secretAccessKey: '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',
          region: 'us-east-2',
          params: {
            ACL: 'public-read',
            signedUrlExpires: 15 * 60,
            Bucket: 'barberiafigaro-server-strapi',
          },
        },
      },
    },
  },
});