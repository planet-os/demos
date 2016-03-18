var MetadataModel = Backbone.Model.extend({
    defaults: {
        context: null,
        key: null,
        longName: null,
        missingValue: null,
        name: null,
        units: null,
        abbreviation: null
    }
});

var ActiveMetadataModel = MetadataModel.extend({
    initialize: function(options) {
        this.queryModel = options.queryModel;
        this.metadataCollection = options.metadataCollection;

        this.listenTo(this.queryModel, 'change set', this.setActiveModel);
    },

    setActiveModel: function(model) {
        console.log(666);
    }
});

var MetadataCollection = BaseCollection.extend({

    model: MetadataModel,

    initialize: function(options) {
        this.queryModel = options.queryModel;
        this.listenTo(this.queryModel, 'change set', function() {
            this.fetch({
                reset: true
            });
        });
    },

    parse: function(response) {
        var contexts = response.metadata.contexts;
        var variables = [];
        for(var context in contexts) {
            var contextVariables = contexts[context].dataVariables;
            for(var variable in contextVariables) {
                var metadata = contextVariables[variable];
                var missingValue = (typeof metadata.missing_value !== 'undefined') ? metadata.missing_value : value.attributes._FillValue
                if(missingValue === 'NaN') {
                    missingValue = NaN
                }
                variables.push({
                    context: context,
                    key: variable,
                    longName: metadata.long_name,
                    missingValue: missingValue,
                    name: metadata.standard_name,
                    units: metadata.units,
                    abbreviation: metadata.abbreviation,
                });
            }
        }

        return variables;
    }
});