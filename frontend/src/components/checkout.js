const Checkout = {
  render: (props) => `
        <div class="checkout">
        <div class="${props.step1 ? 'active' : ''}">Sign-in</div>
        <div class="${props.step2 ? 'active' : ''}">Shipping</div>
        <div class="${props.step3 ? 'active' : ''}">Payment</div>
        <div class="${props.step4 ? 'active' : ''}">Place order</div>
        </div>
        `,
};
export default Checkout;
