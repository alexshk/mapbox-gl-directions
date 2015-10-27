import template from 'lodash.template';
import debounce from 'lodash.debounce';
// import typeahead from 'typeahead';

let fs = require('fs'); // substack/brfs#39
let tmpl = template(fs.readFileSync(__dirname + '/../templates/inputs.html', 'utf8'));

/**
 * Inputs controller
 *
 * @param {HTMLElement} el Summary parent container
 * @param {Object} data Data passed from store
 * @param {Actions} actions All available actions an element can dispatch
 * @private
 */
export default class Inputs {
  constructor(el, store, actions) {
    const { originQuery, destinationQuery, mode } = store.getState();

    el.innerHTML = tmpl({
      originQuery,
      destinationQuery,
      mode
    });

    this.container = el;
    this.actions = actions;
    this.onAdd();
    store.subscribe(this.render.bind(this, store.getState()));
  }
  onAdd() {
    const { reverseInputs, queryOrigin, setMode } = this.actions;

    // Events
    this.container.querySelector('.js-reverse-inputs').addEventListener('click', reverseInputs);
    this.container.querySelector('.js-origin').addEventListener('keypress', debounce((e) => {
      queryOrigin(e.target.value);
    }), 100);

    // Driving / Walking / Cycling modes
    const profiles = this.container.querySelectorAll('input[type="radio"]');
    Array.prototype.forEach.call(profiles, (el) => {
      el.addEventListener('change', () => {
        setMode(el.id.split('-').pop());
      });
    });

  }
  render(store) {
    console.log('occur', store);
  }
}
