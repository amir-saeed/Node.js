

var Container = React.createClass({
 getInitialState(){
    return { showModal: false };
  },
  close(){
    this.setState({ showModal: false });
  },
  open(){
    this.setState({ showModal: true });
  },
  render() {
    return (
      <div className="jumbotron">
        <p>
          <a className="btn btn-primary"
            href="#" role="button"
            onClick={this.open}> Help
          </a>
        </p>
        <Modal show={this.state.showModal} onHide={this.close}/>
      </div>
    );
  }
});

var Modal = React.createClass({
  render() {
    return <div 
    className={classNames('alert alert-success alert-dismissible', { hidden: !this.props.show}) } role="alert">
    <button type="button"
      className="close" onClick={this.props.onHide}>
      <span>&times;</span>
    </button>
    <strong>Well done!</strong> Click the button on the right to dismiss.
  </div>;
  }
});

React.render(<Container />, document.getElementById('app'));