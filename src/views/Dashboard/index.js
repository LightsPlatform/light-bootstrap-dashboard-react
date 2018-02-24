import React, {Component} from 'react';
import ChartistGraph from 'react-chartist';
import {Grid, Row, Col} from 'react-bootstrap';


import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';
import {
    dataPie,
    legendPie,
    dataSales,
    optionsSales,
    responsiveSales,
    legendSales,
    dataBar,
    optionsBar,
    responsiveBar,
    legendBar
} from 'variables/Variables.jsx';
import axios from 'axios'

class Dashboard extends Component {

    instance = axios.create({
        baseURL: '/api/',
        timeout: 60000,
        headers: {'Accept': 'application/json'}
    });

    constructor(props) {
        super(props)
        this.state = {
            brokers: {
                count: 0,
                connect: false
            },
            sensors: {
                count: 0,
                connect: false
            },
            actuators: {
                count: 0,
                connect: false
            },
        }
    }

    componentDidMount() {
        this.checkConnection()
    }

    checkConnection() {
        const me = this
        this.instance.get('check')
            .then(function (response) {
                if (response.data === "ok") {
                    me.setState({
                        brokers: {
                            count: 0,
                            connect: true
                        },
                        sensors: {
                            count: 0,
                            connect: true
                        },
                        actuators: {
                            count: 0,
                            connect: true
                        },
                    })
                    me.getSensorCount()
                    me.getActuatorCount()
                    me.getBrokerCount()
                }
            })
    }

    getSensorCount() {
        const me = this
        this.instance.get('sensors')
            .then(function (response) {
                me.setState({sensors:{count:response.data.sensors.length,connect:true}})
            })
    }

    getActuatorCount() {
        const me = this
        this.instance.get('actuators')
            .then(function (response) {
                me.setState({actuators:{count:response.data.actuators.length,connect:true}})
            })
    }

    getBrokerCount() {
        const me = this
        this.instance.get('brokers')
            .then(function (response) {
                me.setState({brokers:{count:response.data.groups.length,connect:true}})
            })
    }

    createLegend(json) {
        var legend = [];
        for (var i = 0; i < json["names"].length; i++) {
            var type = "fa fa-circle text-" + json["types"][i];
            legend.push(
                <i className={type} key={i}></i>
           );
            legend.push(" ");
            legend.push(
                json["names"][i]
            );
        }
        return legend;
    }


    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={4} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="Brokers"
                                statsValue={this.state.brokers.count}
                                statsIcon={<i className="fa pe-7s-smile"></i>}
                                statsIconText={this.state.brokers.connect ? "connected" : "disconnect"}
                            />
                        </Col>
                        <Col lg={4} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-signal text-success"></i>}
                                statsText="Sensors"
                                statsValue={this.state.sensors.count}
                                statsIcon={<i className="fa pe-7s-smile"></i>}
                                statsIconText={this.state.sensors.connect ? "connected" : "disconnect"}
                            />
                        </Col>
                        <Col lg={4} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-light text-info"></i>}
                                statsText="Actuators"
                                statsValue={this.state.actuators.count}
                                statsIcon={<i className="fa pe-7s-smile"></i>}
                                statsIconText={this.state.actuators.connect ? "connected" : "disconnect"}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <Card
                                statsIcon="fa fa-history"
                                id="chartHours"
                                title="Users Behavior"
                                category="24 Hours performance"
                                stats="Updated 3 minutes ago"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={dataSales}
                                            type="Line"
                                            options={optionsSales}
                                            responsiveOptions={responsiveSales}
                                        />
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(legendSales)}
                                    </div>
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <Card
                                statsIcon="fa fa-clock-o"
                                title="Email Statistics"
                                category="Last Campaign Performance"
                                stats="Campaign sent 2 days ago"
                                content={
                                    <div id="chartPreferences" className="ct-chart ct-perfect-fourth">
                                        <ChartistGraph data={dataPie} type="Pie"/>
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(legendPie)}
                                    </div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Card
                                id="chartActivity"
                                title="2014 Sales"
                                category="All products including Taxes"
                                stats="Data information certified"
                                statsIcon="fa fa-check"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={dataBar}
                                            type="Bar"
                                            options={optionsBar}
                                            responsiveOptions={responsiveBar}
                                        />
                                    </div>
                                }
                                legend={
                                    <div className="legend">
                                        {this.createLegend(legendBar)}
                                    </div>
                                }
                            />
                        </Col>

                        <Col md={6}>
                            <Card
                                title="Tasks"
                                category="Backend development"
                                stats="Updated 3 minutes ago"
                                statsIcon="fa fa-history"
                                content={
                                    <div className="table-full-width">
                                        <table className="table">
                                            <Tasks/>
                                        </table>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }
}

export default Dashboard;
