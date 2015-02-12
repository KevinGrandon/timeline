var stubData = [{
  type: 'item',
  title: 'Flying from CDG to SFO',
  meta: 'Departing 8:00AM, Terminal 3',
  iconClass: 'travel'
},
{
  type: 'item',
  title: '70% chance of rain in Paris',
  meta: 'bring an umbrella',
  iconClass: 'climacon rain'
}, {
  type: 'item',
  manifestURL: 'app://calendar.gaiamobile.org/manifest.webapp',
  title: '10 meetings',
  meta: 'looks like it\'s going to be a busy day',
  iconClass: 'event'
}, {
  type: 'item',
  manifestURL: 'app://clock.gaiamobile.org/manifest.webapp',
  title: 'Wake up for work!',
  meta: 'Alarm at 8:00AM tomorrow',
  iconClass: 'alarm'
}, {
  type: 'item',
  manifestURL: 'app://calendar.gaiamobile.org/manifest.webapp',
  title: 'Meeting at 10:00 AM',
  meta: 'with Chris Lee, Faramarz, and 4 others.',
  iconClass: 'event'
}, {
  type: 'horizon'
}, {
  type: 'item',
  manifestURL: 'app://gallery.gaiamobile.org/manifest.webapp',
  meta: 'You took 4 pictures',
  photos: [
    '/style/temp/sample1.jpg',
    '/style/temp/sample2.jpg',
    '/style/temp/sample3.jpg'
  ],
  iconClass: 'picture'
}, {
  type: 'item',
  manifestURL: 'app://sms.gaiamobile.org/manifest.webapp',
  meta: 'Received an SMS from Jaime Chen',
  message: 'Hey Kevin - this is probably the best FxOS experience I have ever seen in...',
  iconClass: 'message'
}, {
  type: 'item',
  manifestURL: 'app://sms.gaiamobile.org/manifest.webapp',
  title: 'Meeting with Andreas',
  meta: 'And 4 other Events',
  iconClass: 'event'
}, {
  type: 'item',
  manifestURL: 'app://email.gaiamobile.org/manifest.webapp',
  title: 'Received 50 emails',
  meta: 'tagged with dev-gaia, dev-b2g and more',
  iconClass: 'email'
}, {
  type: 'item',
  manifestURL: 'app://sms.gaiamobile.org/manifest.webapp',
  meta: 'Received an SMS from Mom',
  message: 'Clean your room!',
  iconClass: 'message'
}];

// More data
stubData = stubData.concat(stubData.slice(6));
stubData = stubData.concat(stubData.slice(6));
stubData = stubData.concat(stubData.slice(6));

function getStreamData() {
  return new Promise(resolve => {
    resolve(stubData);
  });
}
