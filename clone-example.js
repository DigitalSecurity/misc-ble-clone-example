/**
 * Bluetooth Low Energy Clone Example for MISC mag n°86.
 *
 * Damien "virtualabs" Cauquil <damien.cauquil@digitalsecurity.fr>
 * Lény "bik3te" Bueno <leny.bueno@digitalsecurity.fr>
 **/

var bleno = require('bleno');

/* On démarre l'envoi des annonces lorsque l'adaptateur Bluetooth est prêt. */
bleno.on('stateChange', function(state){
  if (state === 'poweredOn') {
    bleno.startAdvertising(
      'Porte-cle', [
        '180F',
        '1802',
        '7b122568-6677-7f8c-f8e9-af0eedb36e3a'
    ]);
  } else {
    bleno.stopAdvertising();
  }
});

/**
 * On déclare les services exposés par notre clone une fois les annonces en
 * cours d'envoi. Dans le cas présent, ces services exposent des caractéris-
 * tiques accessibles en lecture et/ou écriture, ainsi que certaines supportant
 * les notifications.
 **/

bleno.on('advertisingStart', function(error){
  if (!error) {
    console.log('set services');
    bleno.setServices([

      /** Battery Service **/
      new bleno.PrimaryService({
        uuid: '180F',
        characteristics: [
          new bleno.Characteristic({
            uuid: '2A19',
            properties: ['read','notify'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([100]));
            },
            descriptors:[
              new bleno.Descriptor({
                uuid:'2902',
                value:'Notifications'
              })
            ]
          })
        ],
      }),

      /** Immediate Alert **/
      new bleno.PrimaryService({
        uuid: '1802',
        characteristics: [
          new bleno.Characteristic({
            uuid: '2A06',
            properties: ['write'],
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              callback(bleno.RESULT_SUCCESS);
            }
          })
        ]
      }),

      /** Link Loss **/
      new bleno.PrimaryService({
        uuid:'1803',
        characteristics: [
          new bleno.Characteristic({
            uuid:'2A06',
            properties: ['write','read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00]));
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              callback(bleno.RESULT_SUCCESS);
            }
          }),
        ]
      }),

      /* Premier service "propriétaire" propre au porte-clé connecté. */
      new bleno.PrimaryService({
        uuid:'4f172801-1867-a896-28c0-1bfbc156fa45',
        characteristics: [
          new bleno.Characteristic({
            uuid:'4f172491-1867-a896-28c0-1bfbc156fa45',
            properties: ['notify','read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00]));
            },
            descriptors:[
              new bleno.Descriptor({
                uuid:'2902',
                value:'Notifications'
              })
            ]
          }),
          new bleno.Characteristic({
            uuid:'4f172492-1867-a896-28c0-1bfbc156fa45',
            properties: ['notify','read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00]));
            },
            descriptors:[
              new bleno.Descriptor({
                uuid:'2902',
                value:'Notifications'
              })
            ]
          }),
        ]
      }),

      /** Autre service "propriétaire" propre au porte-clé connecté. **/
      new bleno.PrimaryService({
        uuid:'b0ad1523-99b2-7e1d-fc0d-6d399e1edf02',
        characteristics: [
          new bleno.Characteristic({
            uuid:'b0ad1524-99b2-7e1d-fc0d-6d399e1edf02',
            properties: ['notify','read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00]));
            },
            descriptors:[
              new bleno.Descriptor({
                uuid:'2902',
                value:'0000'
              })
            ]
          }),
          new bleno.Characteristic({
            uuid:'b0ad1525-99b2-7e1d-fc0d-6d399e1edf02',
            properties: ['read','write'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00]));
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              callback(bleno.RESULT_SUCCESS);
            }
          }),
          new bleno.Characteristic({
            uuid:'b0ad1526-99b2-7e1d-fc0d-6d399e1edf02',
            properties: ['read','write'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00]));
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              callback(bleno.RESULT_SUCCESS);
            }
          }),

        ]
      }),

      /** Service spécifique au porte-clé connecté (encore) **/
      new bleno.PrimaryService({
        uuid:'7b122568-6677-7f8c-f8e9-af0eedb36e3a',
        characteristics: [
          new bleno.Characteristic({
            uuid: '7b121991-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x01, 0x03]));
            }
          }),
          new bleno.Characteristic({
            uuid: '7b121992-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer( [0x4e, 0x6f,0x76,0x20,0x20,0x33,0x20,0x32,0x30,0x31,0x34,0x00]));
            }
          }),
          new bleno.Characteristic({
            uuid: '7b121993-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read','write'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00,0x00,0x00]));
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              callback(bleno.RESULT_SUCCESS);
            }
          }),
          new bleno.Characteristic({
            uuid: '7b121994-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00,0x00,0x00]));
            },
          }),
          new bleno.Characteristic({
            uuid: '7b121995-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x00,0x00,0x00,0x00]));
            },
          }),
          new bleno.Characteristic({
            uuid: '7b121996-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              var buffer = new Buffer(100);
              buffer.fill(0);
              callback(bleno.RESULT_SUCCESS, buffer);
            },
          }),
          new bleno.Characteristic({
            uuid: '7b121997-66777f8c-f8e9-af0eedb36e3a',
            properties: ['write'],
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              callback(bleno.RESULT_SUCCESS);
            },
          }),
          new bleno.Characteristic({
            uuid: '7b121998-66777f8c-f8e9-af0eedb36e3a',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              callback(bleno.RESULT_SUCCESS, new Buffer([0x13]));
            },
          }),
        ]
      })
    ]);
  }
});

/* On garde une trace des connexions réalisées sur notre clone. */
bleno.on('accept', function(client){
  console.log('Connection accepted from: '+client);
});
