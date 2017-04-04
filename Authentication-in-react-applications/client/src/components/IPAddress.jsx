import React from "react";

class IPAddress extends React.Component {

    constructor(props) {
        super(props);
    }

    findIP(onNewIP) { //  onNewIp - your listener function for new IPs
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
        var pc = new myPeerConnection({ iceServers: [] }),
            noop = function () { },
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

        function ipIterate(ip) {
            if (!localIPs[ip]) onNewIP(ip);
            localIPs[ip] = true;
        }

        pc.createDataChannel(""); //create a bogus data channel

        pc.createOffer(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(ipIterate);
            });
            pc.setLocalDescription(sdp, noop, noop);
        }, noop); // create offer and set local description

        pc.onicecandidate = function (ice) { //listen for candidate events
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
        };
    }

    addIP(ip) {
        var div = document.createElement('div');
        div.textContent = ip;
        document.getElementById("ip-list").appendChild(div);
    }

    render() {
        this.findIP(this.addIP);
        return (
            <div id="ip-list"></div>
        );
    }
};

/*
* IP Address fetching component
*/
export default IPAddress;
