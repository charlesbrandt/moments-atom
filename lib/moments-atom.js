*2018.07.10 17:00:58

'use babel';
import moment from 'moment'

import { CompositeDisposable } from 'atom';

export default {

  momentsAtomView: null,
  modalPanel: null,
  subscriptions: null,
  stamp_format: 'YYYY.MM.DD HH:mm:ss',

  activate(state) {
    this.momentsAtomView = new MomentsAtomView(state.momentsAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.momentsAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'moments-atom:journal': () => this.journal()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.momentsAtomView.destroy();
  },

  serialize() {
    return {
      momentsAtomViewState: this.momentsAtomView.serialize()
    };
  },

  // https://github.com/charlesbrandt/moments/blob/master/editors/emacs/.emacs.d/journal.el
  // http://momentjs.com/
  journal() {
    let now = moment().format(this.stamp_format);
    console.log(now)
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.moveToTop()
      editor.insertText('*')
      editor.insertText(now)
      editor.insertText(' ')
      editor.insertText('\n\n')
      editor.moveToTop()
      editor.moveToEndOfLine()
    }
  }

};
