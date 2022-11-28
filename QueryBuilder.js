//
class QueryBuilder {


    //mock soql query components
    static SQL_EQ = "=";
    static SQL_LIKE = "LIKE";
    static SQL_GT = ">";
    static SQL_LT = "<";


    constructor(query) {
      this.query = query;
    }
  

    render(locale) {
      let container = document.getElementById(locale);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      let checkboxes = [];
      checkboxes = this.query.where.map(this.conditionToCheckbox);
      //checkboxes.push(this.limitToCheckbox(this.query.limit));
  
      // Add the created li's (from above) to the current document.
      checkboxes.forEach((checkbox) => {
        container.appendChild(checkbox);
      });
      document.addEventListener("click", this.getBox.bind(this), true);
    }
  
    getBox(e) {
      let box = e.target;
      if (!box.classList.contains("query-filter")) return;
      
      if(box.readonly == "true" || box.readonly === true) {
        return;
      }
  
      let field = box.dataset.field;
      let value = box.dataset.value;
      let op = box.dataset.op;
  
      let cond = {
        field: field,
        value: value,
        op: op
      };
      
      console.log(box.checked);

      if (box.checked == true) {
        this.addCondition(cond);
      } else {
        this.removeCondition(cond);
      }

      let evt = new CustomEvent('querychange', {
          detail: this.query
      });

      document.dispatchEvent(evt);
    }
  

    

    addCondition(field, value = null, op = null) {

        if(!value) {
          this.addConditionObject(field);
          return;
        }

        else if(!op) {
          let cond = {
            field: field,
            op: QueryBuilder.SQL_EQ,
            value: value,
            editable: false
          };

          this.addConditionObject(cond);
        }

        else {
          let cond = {
            field: field,
            op: op,
            value: value,
            editable: false
          };

          this.addConditionObject(cond);
        }

    }

    addConditionObject(c) {
      if (!c.field || !c.op)
      {
          throw new Error('Invalid condition object');
      }
      this.query.where.push(c);
    }


    updateCondition(c) {
      this.removeCondition(c);
      this.addCondition(c);
    }
  

    removeCondition(c) {
        if (!c.field || !c.op)
        {
            throw new Error('Invalid condition object');
        }
      let newWhere = this.query.where.filter((cond) => {
        //remove equivalent fields from where
        if (c.field == cond.field && c.value == cond.value) {
          return false;
        }
        return true;
      });
      this.query.where = newWhere;
    }


    getObject() {
      return this.query;
    }


    conditionToCheckbox(c) {
      // Create li elements; each li will have a <label> and <input type="checkbox"> element as "children."
      console.log(c);
      let myLi = document.createElement("li");
      let myOp = c.op || SQL_EQ;
      let myField = c.field;
      let editable = c.editable === false ? false : true;

      if (c.op == 'LIKE')
      {
          myOp = '=';
      }
      myField = myField.replace('Ocdla_', '');
      myField = myField.replace('__c', '');
      myField = myField.replaceAll('_', ' ');
      

      let label = document.createElement("label");
      label.innerHTML = " " + myField + "  " + myOp + " " + c.value;
      let box = document.createElement("input");
      let classes = ["query-filter"];
      if(!editable) {
        classes.push("query-filter-readonly");
      }
      box.setAttribute("type", "checkbox");
      box.setAttribute("class", classes.join(" "));
      box.setAttribute("data-field", c.field);
      box.setAttribute("data-value", c.value);
      box.setAttribute("data-op", myOp);
      box.setAttribute("data-feature-name", "search");
      box.setAttribute("checked", "checked");
      if(!editable) {
        box.onclick = function(e) { e.stopPropagation(); e.preventDefault; return false; };
      } 
  
      myLi.appendChild(box);
      myLi.appendChild(label);
      return myLi;
    }

    setOption(name, value) {
      this.query[name] = value;
    }

    getOption(name) {
      return this.query[name];
    }
  
    limitToCheckbox(limit) {
      // Create li elements; each li will have a <label> and <input type="checkbox"> element as "children."
      let myLi = document.createElement("li");
      let label = document.createElement("label");
      label.innerHTML = " Limit = " + limit;
      let box = document.createElement("input");
      box.setAttribute("type", "checkbox");
      box.setAttribute("class", "query-filter");
      box.setAttribute("data-limit", limit);
      box.setAttribute("checked", "checked");
      box.setAttribute("disabled", true);
  
      myLi.appendChild(box);
      myLi.appendChild(label);
      return myLi;
    }
  }
  
  // export statements.
  export default QueryBuilder;
  