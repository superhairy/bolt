module.exports = {
  media: {
    image: {
      src: '/fixtures/landscape-16x9-mountains.jpg',
      lazyload: false,
    },
    icon: {
      name: 'add-open',
      size: 'large',
    },
    video: {
      videoId: '3861325118001',
      accountId: '1900410236',
      playerId: 'r1CAdLzTW',
      showMeta: true,
      showMetaTitle: true,
    },
    table: {
      headers: {
        top: {
          cells: ['Column 1', 'Column 2', 'Column 3'],
        },
        side: {
          cells: ['Row 1', 'Row 2', 'Row 3', 'Footer'],
        },
      },
      rows: [
        {
          cells: ['R1C1', 'R1C2', 'R1C3'],
        },
        {
          cells: ['R2C1', 'R2C2', 'R2C3'],
        },
        {
          cells: ['R3C1', 'R3C2', 'R3C3'],
        },
      ],
      footer: {
        cells: ['FC1', 'FC2', 'FC3'],
      },
    },
  },
};