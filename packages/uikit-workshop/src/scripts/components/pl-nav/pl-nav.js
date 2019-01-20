import { define, props } from 'skatejs';
import { h } from 'preact';

const classNames = require('classnames');

import { store } from '../../store.js'; // redux store
import ArrowIcon from '../../../icons/arrow-down.svg';
import { BaseComponent } from '../base-component.js';
import { scrollTo, scrollIntoView } from 'scroll-js';
import $ from 'jquery';
import 'url-search-params-polyfill';

const SubSubList = (props) => {
  const { children, category, elem } = props;
  const reorderedChildren = [];
  
  const nonViewAllItems = children.filter((item => (item.patternName !== 'View All' && !item.patternName.includes(' Docs'))));
  // const nonViewAllItems = children.filter((item => (item.patternName !== 'View All')));
  const viewAllItems = children.filter((item => item.patternName === 'View All'));
  
  reorderedChildren.push(...viewAllItems, ...nonViewAllItems);

  return (
    <li
      className={`pl-c-nav__item pl-c-nav__item--${
        category.toLowerCase()
      }`}
    >

      {
        viewAllItems.length > 0 ?
          viewAllItems.map((patternSubtypeItem) =>
            <div class="pl-c-nav__link--overview-wrapper">
              <a href={`patterns/${patternSubtypeItem.patternPath}`}
                className={`pl-c-nav__link pl-c-nav__link--sublink
                ${patternSubtypeItem.patternName === 'View All' ? 'pl-c-nav__link--overview pl-js-link-overview' : 'pl-c-nav__link--subsublink'}
                `}
                onClick={(e) => elem.handleClick(e, patternSubtypeItem.patternPartial)}
                data-patternpartial={patternSubtypeItem.patternPartial}>
                  { 
                    patternSubtypeItem.patternName === 'View All' ? 
                    `${category}` : 
                    patternSubtypeItem.patternName  
                  }
                  { patternSubtypeItem.patternState && (
                    <span
                      class={`pl-c-pattern-state pl-c-pattern-state--${
                        patternSubtypeItem.patternState
                      }`}
                      title={patternSubtypeItem.patternState}
                    />
                  )}
                </a>

                {
                  nonViewAllItems.length > 1 && (
                    <SpecialButton
                      aria-controls={category}
                      onClick={elem.toggleSpecialNavPanel}
                      isOpen={false}
                      isOpenClass={elem.isOpenClass}
                    >
                      {category}
                    </SpecialButton>
                  )
                }
          </div>) :
            (<Button
              aria-controls={category}
              onClick={elem.toggleNavPanel}
              isOpen={false}
              isOpenClass={elem.isOpenClass}
            >
              {category}
            </Button>)
      }

      {
        ((viewAllItems.length > 0 && nonViewAllItems.length > 1) || (viewAllItems.length === 0)) && (
          <ol id={category}
          className={`pl-c-nav__subsublist pl-c-nav__subsublist--dropdown pl-js-acc-panel`}>
            {
              nonViewAllItems.map((patternSubtypeItem) =>
                <li class="pl-c-nav__item">
                  <a href={`patterns/${patternSubtypeItem.patternPath}`}
                    className={`pl-c-nav__link pl-c-nav__link--sublink
                      ${patternSubtypeItem.patternName === 'View All' ? 'pl-c-nav__link--overview' : 'pl-c-nav__link--subsublink'}
                    `}
                    onClick={(e) => elem.handleClick(e, patternSubtypeItem.patternPartial)}
                    data-patternpartial={patternSubtypeItem.patternPartial}>
                      { 
                        patternSubtypeItem.patternName === 'View All' ? 
                        `${category} Overview` : 
                        patternSubtypeItem.patternName  
                      }
                      { patternSubtypeItem.patternState && (
                        <span
                          class={`pl-c-pattern-state pl-c-pattern-state--${
                            patternSubtypeItem.patternState
                          }`}
                          title={patternSubtypeItem.patternState}
                        />
                      )}
                    </a>
                </li>
              )
            }
          </ol>
        )
      }
    </li>
  );
};

const SpecialButton = props => {
  return (
    <button
      className={`pl-c-nav__link pl-c-nav__link--section-dropdown pl-js-acc-handle ${props.isOpen ? props.isOpenClass : ''}`}
      role="tab"
      {...props}
    >
      <span class="pl-c-nav__link-icon">
        <ArrowIcon
          height={16}
          width={16}
          viewBox="0 0 24 24"
          fill="currentColor"
        />
      </span>
      {props.children}
    </button>
  );
};

const Button = props => {
  return (
    <button
      className={`pl-c-nav__link pl-c-nav__link--dropdown pl-js-acc-handle ${props.isOpen ? props.isOpenClass : ''}`}
      role="tab"
      {...props}
    >
      <span class="pl-c-nav__link-icon">
        <ArrowIcon
          height={16}
          width={16}
          viewBox="0 0 24 24"
          fill="currentColor"
        />
      </span>
      {props.children}
    </button>
  );
};

const ButtonTitle = props => {
  return (
    <button
      className={`pl-c-nav__link pl-c-nav__link--title pl-js-acc-handle ${props.isOpen ? props.isOpenClass : ''}`}
      role="tab"
      {...props}
    >
      <span class="pl-c-nav__link-icon">
        <ArrowIcon
          height={16}
          width={16}
          viewBox="0 0 24 24"
          fill="currentColor"
        />
      </span>
      {props.children}
    </button>
  );
};

@define
class Nav extends BaseComponent {
  static is = 'pl-nav';

  constructor(self) {
    self = super(self);
    self.toggleNavPanel = self.toggleNavPanel.bind(self);
    self.toggleSpecialNavPanel = self.toggleSpecialNavPanel.bind(self);
    self.handleClick = self.handleClick.bind(self);
    self.handleURLChange = self.handleURLChange.bind(self);
    self._hasInitiallyRendered = false;
    self.handleURLChangeOnRender = false;
    // self.receiveIframeMessage = self.receiveIframeMessage.bind(self);
    self.isOpenClass = 'pl-is-active';
    self.useShadow = false;
    return self;
  }

  connected() {
    const state = store.getState();
    this.layoutMode = state.app.layoutMode || 'vertical';
    this.elem = this;
    this.previousActiveLinks = [];
    this.iframeElem = document.querySelector('pl-iframe');
  }

  _stateChanged(state) {
    this.layoutMode = state.app.layoutMode || 'vertical';
    this.currentUrl = state.app.currentUrl;
    this.handleURLChange();
  }

  handleClick(event, pattern) {
    event.preventDefault();
    this.iframeElem.navigateTo(pattern);

    this.navContainer = document.querySelector('.pl-js-nav-container');
    this.navAccordionTriggers = document.querySelectorAll('.pl-js-acc-handle');
    this.navAccordionPanels = document.querySelectorAll('.pl-js-acc-panel');

    if (window.matchMedia("(max-width: calc(42em - 1px))").matches || this.layoutMode === 'horizontal'){
      this.navContainer.classList.remove('pl-is-active');
      this.navAccordionTriggers.forEach((trigger) => {
        trigger.classList.remove('pl-is-active');
      });
      this.navAccordionPanels.forEach((panel) => {
        panel.classList.remove('pl-is-active');
      });
    } else {
      this.navContainer.classList.remove('pl-is-active');
    }
  }

  handleURLChange() {
    if (!this._hasInitiallyRendered){
      this.handleURLChangeOnRender = true;
      return;
    }
  
    const shouldAutoOpenNav = window.matchMedia("(min-width: calc(42em))").matches && this.layoutMode === 'vertical';

    const currentUrl = this.currentUrl;
    const activeLink = document.querySelector(`[data-patternpartial="${currentUrl}"]`);
    const self = this;
    
    if (this.previousActiveLinks){
      this.previousActiveLinks.forEach(function(link, index){
        self.previousActiveLinks[index].classList.remove('pl-is-active');
      });
    }
    this.previousActiveLinks = [];
    
    if (activeLink){
      activeLink.classList.add('pl-is-active');
      this.previousActiveLinks.push(activeLink);

      // handle overview links vs nested links
      if (activeLink.classList.contains('pl-js-link-overview')){
        const childDropdownTrigger = activeLink.nextSibling;
        const childDropdown = activeLink.parentNode.nextSibling;

        if (childDropdown && shouldAutoOpenNav){
          if (childDropdown.tagName){
            childDropdown.classList.add('pl-is-active');
            this.previousActiveLinks.push(childDropdown);
          }
        }

        if (childDropdownTrigger && shouldAutoOpenNav){
          if (childDropdownTrigger.tagName){
            childDropdownTrigger.classList.add('pl-is-active');
            this.previousActiveLinks.push(childDropdownTrigger);
          }
        }
      }

      const parentDropdown = activeLink.closest('.pl-js-acc-panel');
      let parentDropdownTrigger = parentDropdown.previousSibling;

      if (parentDropdown.previousSibling.classList.contains('pl-c-nav__link--overview-wrapper') && shouldAutoOpenNav){
        this.previousActiveLinks.push(parentDropdown.previousSibling);
        parentDropdown.previousSibling.classList.add('pl-is-active');
        parentDropdownTrigger = parentDropdown.previousSibling.querySelector('.pl-js-acc-handle');
      }

      const grandparentDropdown = parentDropdown.closest('.pl-c-nav__sublist--dropdown');
      const grandparentDropdownTrigger = grandparentDropdown.previousSibling;

      if (parentDropdown && shouldAutoOpenNav){
        parentDropdown.classList.add('pl-is-active');
        this.previousActiveLinks.push(parentDropdown);
      }
      
      // don't auto-open 
      if (parentDropdownTrigger){
        if (shouldAutoOpenNav === true || parentDropdownTrigger.classList.contains('pl-c-nav__link--title') === false) {
          parentDropdownTrigger.classList.add('pl-is-active');
          this.previousActiveLinks.push(parentDropdownTrigger);
        }
      }
      
      if (grandparentDropdown && shouldAutoOpenNav){
        if (shouldAutoOpenNav){
          grandparentDropdown.classList.add('pl-is-active');
        }
        this.previousActiveLinks.push(grandparentDropdown);
      }

      if (grandparentDropdownTrigger && shouldAutoOpenNav){
        if (shouldAutoOpenNav){
          grandparentDropdownTrigger.classList.add('pl-is-active');
        }
        this.previousActiveLinks.push(grandparentDropdownTrigger);
      }
    }
  }

  static props = {
    autoClose: {
      ...props.boolean,
      ...{ default: true },
    },
    layoutMode: props.string,
    collapsedByDefault: {
      ...props.boolean,
      ...{ default: true },
    },
  };

  toggleSpecialNavPanel(e) {
    const $this = $(e.target);
    const $panel = $this.parent().next();
    const $subnav = $panel.parent().parent().hasClass('pl-js-acc-panel');

    if (!$subnav) {
      $('.pl-js-acc-handle')
        .not($this)
        .removeClass(this.isOpenClass);
      $('.pl-js-acc-panel')
        .not($panel)
        .removeClass(this.isOpenClass);
    }

    // Activate the selected panel
    $this.toggleClass(this.isOpenClass);
    $panel.toggleClass(this.isOpenClass);
  }

  toggleNavPanel(e) {
    const $this = $(e.target);
    const $panel = $this.next('.pl-js-acc-panel');
    const $subnav = $this
      .parent()
      .parent()
      .hasClass('pl-js-acc-panel');

    if (!$subnav) {
      $('.pl-js-acc-handle')
        .not($this)
        .removeClass(this.isOpenClass);
      $('.pl-js-acc-panel')
        .not($panel)
        .removeClass(this.isOpenClass);
    }

    // Activate the selected panel
    $this.toggleClass(this.isOpenClass);
    $panel.toggleClass(this.isOpenClass);
  }

  rendered(){
    if (this._hasInitiallyRendered === false){
      this._hasInitiallyRendered = true;
    }

    if (this.handleURLChangeOnRender === true){
      this.handleURLChangeOnRender = false;
      this.handleURLChange();
    }
  }

  render({ layoutMode }) {
    const patternTypes = window.navItems.patternTypes;

    return (
      <ol class="pl-c-nav__list pl-js-pattern-nav-target">
        {patternTypes.map((item, i) => {
          const classes = classNames({
            [`pl-c-nav__item pl-c-nav__item--${item.patternTypeLC}`]: true,
          });

          const patternItems = item.patternItems;

          return (
            <li className={classes}>

              <ButtonTitle
                aria-controls={item.patternTypeLC}
                onClick={this.toggleNavPanel}
                isOpen={false}
                isOpenClass={this.isOpenClass}
              >
                {item.patternTypeUC}
              </ButtonTitle>

              <ol
                id={item.patternSubtypeUC}
                className={`pl-c-nav__sublist pl-c-nav__sublist--dropdown pl-js-acc-panel`}
              >
                {item.patternTypeItems.map((patternSubtype, i) => {
                  return (
                    <SubSubList elem={this.elem} category={patternSubtype.patternSubtypeUC}>
                      {patternSubtype.patternSubtypeItems}
                    </SubSubList>
                  );
                })}

                {patternItems &&
                  patternItems.map((patternItem, i) => {
                    return (
                      <li class="pl-c-nav__item">
                        <a
                          href={`patterns/${patternItem.patternPath}`}
                          class="pl-c-nav__link pl-c-nav__link--pattern"
                          onClick={(e) => this.handleClick(e, patternItem.patternPartial)}
                          data-patternpartial={patternItem.patternPartial}
                          tabindex="0"
                        >
                          {patternItem.patternName === 'View All'
                            ? patternItem.patternName + ' ' + item.patternTypeUC
                            : patternItem.patternName}
                          {patternItem.patternState && (
                            <span
                              class={`pl-c-pattern-state pl-c-pattern-state--${
                                patternItem.patternState
                              }`}
                              title={patternItem.patternState}
                            />
                          )}
                        </a>
                      </li>
                    );
                  })}
              </ol>
            </li>
          );
        })}

        {/* <li class="pl-c-nav__item">
          <a
            href="styleguide/html/styleguide.html"
            class="pl-c-nav__link pl-c-nav__link--pattern"
            data-patternpartial="all"
            tabindex="0"
          >
            All
          </a>
        </li> */}
      </ol>
    );
  }
}

export { Nav };
