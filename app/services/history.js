import Ember from 'ember';

var {computed, A} = Ember;

export default Ember.Service.extend(Ember.Evented, {
    stack: A([]),
    startRecordingIndex: -1,
    init: function(model){
        this.set("startRecordingIndex", -1);
        this.clearAll();
        if(model) {
            model.track();
        }
    },
    isEmpty: computed('stack,stack.length', function(){
        return this.get('stack.length') === 0;
    }),
    clearAll: function(){
        this.set('stack', A([]));
    },
    push: function(model){
        this.get('stack').pushObject(model);
    },
    startRecording: function(){
        this.set("startRecordingIndex", this.get('stack.length'));
    },
    stopRecording: function(){
        if (this.get('startRecordignIndex') === -1) {
            return;
        }
        var record = this.get('stack').splice(this.get('startRecordingIndex'), this.get('stack.length'));
        this.set("startRecordingIndex", -1);
        this.get('stack').pushObject(record);
    },
    undoAll: function(){
        if (this.get('isEmpty')) {
            return;
        }
        while(this.undo()){
        }
    },
    undo: function(model){
        var model = model || this.get('stack').popObject();

        this.trigger('restore');

        if (Ember.isArray(model)) {
            model.forEach(m=>{
                this.undo(m);
            });
            return true;
        }
        if(model) {
            model.restore();
            return true;
        }
        return false;
    }
});
