import React, { Component } from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "./index.css";
export default class DropdownContainer extends Component {
constructor(props) {
    super(props);
    this.state = { data: props.data };
  }
  onNodeToggle = currentNode => {
    //set if toggled
    const { data } = this.state;
    data.map(item => {
      if (item.value === currentNode.value) {
        item.expanded = currentNode.expanded
      }
    })
  }
  handleChange = (currentNode,selectedNodes) => {
    const { data } = this.state;

    //if parent selected set data to parent
    if(currentNode._depth === 0 ) {
      data.map(item => {
        if (item.value === currentNode.value) {
          item.checked = currentNode.checked
          item.className = 'flag apiary'
          item.tagClassName= 'flag apiary'
        }
      })
      this.setState({data});
    }

    //if children clicked set data to children
    if(currentNode._depth === 1 ) {
      data.map(item => {
        item.children.map(child => {
          if (child.value === currentNode.value) {
            child.checked = currentNode.checked
            child.className = 'flag beehive'
            child.tagClassName= 'flag beehive'
          }
        })
      })
      this.setState({data});
    }

    // if apiary selected remove selection from beehives and if beehive selected remove selection from apiary
    if(currentNode.checked){
      if(currentNode._depth===0){
        data.map(item => {
          if(item.value === currentNode.value){
            item.children.map(child => {
              child.checked = false
            })
          }
        })
      }
      if(currentNode._depth===1) {
        selectedNodes.map((node) => {
          if (node._id === currentNode._parent) {
            data.map(item => {
              if (item.value === node.value) {
                item.checked = false
              }
            })
          }
        })
      }
    }


  };

  render() {
    return (

      <div>
        <DropdownTreeSelect
          data={this.state.data}
          onChange={this.handleChange}
          onNodeToggle={this.onNodeToggle}
          mode={'hierarchical'}
          showDropdown={'initial'}
          className="bootstrap-demo"
        />
      </div>

    );
  }

}
