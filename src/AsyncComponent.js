import React from "react"

export default class AsyncComponent extends React.Component {

  static propTypes = {
    loadComponent: React.PropTypes.func.isRequired,
    Loader: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    Loader: () => <div>Loading...</div>
  }

  state = {
    Component: null
  }

  componentDidMount() {
    this.props.loadComponent(Component => this.setState({ Component }))
  }

  render() {
    const { Component } = this.state

    // eslint-disable-next-line no-unused-vars
    const { loadComponent, Loader, ...props } = this.props

    if (Component) {
      return <Component {...props} />
    }

    return <Loader {...props} />
  }
}
