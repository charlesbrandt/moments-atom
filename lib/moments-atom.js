'use babel';
import moment from 'moment'

import { CompositeDisposable } from 'atom';

let stamp_format = 'YYYY.MM.DD HH:mm:ss'
let compact_format = 'YYYYMMDDHHmmss'

export default {
  subscriptions: null,

  now: moment().format(stamp_format),
  short: moment().format(compact_format),

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'moments-atom:journal': () => this.journal(),
      'moments-atom:now': () => this.timestamp(),
      'moments-atom:complete': () => this.finish(),
      'moments-atom:also': () => this.also(),
      'moments-atom:requested': () => this.requested(),
      'moments-atom:stamp': () => this.stamp()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  // aka compact, but compact is too close to complete

  stamp() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.insertText(this.short)
    }
  },

  requested() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.delete()
      editor.insertText('requested [')
      editor.moveToEndOfLine()
      editor.insertText(']')
    }
  },

  finish() {
    // assumes the cursor is at the beginning of an existing timestamp starting with *
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.delete()
      editor.insertText('*')
      editor.insertText(this.now)
      editor.insertText(' complete\nrequested [')
      editor.moveRight(stamp_format.length)
      editor.insertText(']')
    }
  },

  also() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.insertText('also [')
      editor.insertText(this.now)
      editor.moveToEndOfLine()
      editor.insertText(']')
    }
  },

  timestamp() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.insertText('*')
      editor.insertText(this.now)
    }
  },

  // see also:
  // https://github.com/charlesbrandt/moments/blob/master/editors/emacs/.emacs.d/journal.el
  // http://momentjs.com/
  journal() {
    console.log(this.now)
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.moveToTop()
      editor.insertText('*')
      editor.insertText(this.now)
      editor.insertText(' ')
      editor.insertText('\n\n')
      editor.moveToTop()
      editor.moveToEndOfLine()
    }
  }

};
