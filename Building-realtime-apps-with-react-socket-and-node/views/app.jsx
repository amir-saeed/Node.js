var socket = io();
var Input = React.createClass({
    _notifyServer: function (event) {
        socket.emit('client event', { value: event.target.value });
    },
    render: function () {
        return (
            <div className="update-label">
                <input type="text" placeholder="Enter text" onChange={this._notifyServer} />
            </div>
        );
    }
});

var Label = React.createClass({
    _onUpdateLabel: function (data) {
        this.setState({serverValue:data.value});
    },
    getInitialState: function () {
        return { serverValue:'' };
    },
    render: function () {
        return (
            <div class="my-label">
                <h2>{this.state.serverValue}</h2>
            </div>
        )
    }
});

var input = React.render(<Input />, document.getElementById('mount-point'));
var label = React.render(<Label />, document.getElementById('label-mount-point'));

socket.on('update label', function (data) {
    label._onUpdateLabel(data);
});