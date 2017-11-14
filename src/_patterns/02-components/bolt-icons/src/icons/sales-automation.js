// import { Preact, h } from 'preact';
const SalesAutomation = ({ color, size, ...otherProps }) => {
  color = color || 'currentColor';
  size = size || '24';
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...otherProps}>
      <title>Icon/product/CRM/Sales Automation</title>
      <path
        d="M30 2H2v3.938h28V2zm0-2c.583 0 1.062.198 1.438.594C31.813.99 32 1.458 32 2v3.938c0 .583-.187 1.062-.563 1.437-.375.375-.854.563-1.437.563H2c-.583 0-1.062-.188-1.438-.563C.188 7 0 6.521 0 5.937V2C0 1.458.187.99.563.594.938.198 1.417 0 2 0h28zm-4 14H6v3.938h20V14zm0-2c.583 0 1.062.198 1.438.594.375.396.562.864.562 1.406v3.938c0 .583-.187 1.062-.563 1.437-.375.375-.854.563-1.437.563H6c-.583 0-1.062-.188-1.438-.563C4.188 19 4 18.521 4 17.937V14c0-.542.187-1.01.563-1.406C4.938 12.198 5.417 12 6 12h20zm-4 13.938H10v3.937h12v-3.938zm0-2c.583 0 1.062.187 1.438.562.375.375.562.854.562 1.438v3.937c0 .542-.187 1.01-.563 1.406-.375.396-.854.594-1.437.594H10c-.583 0-1.062-.198-1.438-.594A1.976 1.976 0 0 1 8 29.875v-3.938c0-.583.187-1.062.563-1.437.375-.375.854-.563 1.437-.563h12z"
        fill="currentColor"
        fill-rule="evenodd"
      />
    </svg>
  );
};
export default SalesAutomation;
