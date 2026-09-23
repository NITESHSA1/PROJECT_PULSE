// Requiring every model file here guarantees each schema is registered with
// Mongoose at startup - so .populate('someRef') never fails just because no
// controller happened to require that model file directly.
require('./User');
require('./Organization');
require('./Membership');
require('./Invitation');
require('./Project');
require('./ProjectMember');
require('./Sprint');
require('./Milestone');
require('./Label');
require('./Task');
require('./StatusHistory');
require('./Comment');
require('./Attachment');
require('./Activity');
require('./Notification');
