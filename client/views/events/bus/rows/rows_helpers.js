if (Meteor.isClient) {
    Template.rowEdit.helpers({
        elementos: function () {
            return _.sortBy(this.elements, function(e) { return e.index; });
        }
    });

    Template.rowShow.helpers({
        classElement: function () {
            switch (this.val) {
                case 'P':
                    response = 'pasillo';
                    break;
                case 'B':
                    response = 'bano';
                    break;
                case 'C':
                    response = 'cafe';
                    break;
                case 'E':
                    response = 'escalera';
                    break;
                default:
                    response = 'asiento';
                    if('pax' in this && this.pax !== ''){
                        response += ' ocupado';
                    }
            }
            return response;
        },
        isAsiento: function() {
            return 'pax' in this && this.pax !== '';
        },
        picture: function() {
            pax =  Meteor.users.findOne({'_id': this.pax});
            return pax.profile.picture;
        }
    });
}
