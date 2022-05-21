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
  
      let checkboxes = [];
      checkboxes = this.query.where.map(this.conditionToCheckbox);
      checkboxes.push(this.limitToCheckbox(this.query.limit));
  
      // Add the created li's (from above) to the current document.
      checkboxes.forEach((checkbox) => {
        container.appendChild(checkbox);
      });
      document.addEventListener("click", this.getBox.bind(this), true);
    }
  
    getBox(e) {
      let box = e.target;
      if (!box.classList.contains("query-filter")) return;
      console.log(box);
  
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
  
    addCondition(c) {
      this.query.where.push(c);
    }
  
    removeCondition(c) {
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
      let myLi = document.createElement("li");
      let myOp = c.op || SQL_EQ;
      let label = document.createElement("label");
      label.innerHTML = " " + c.field + "  " + myOp + " " + c.value;
      let box = document.createElement("input");
      box.setAttribute("type", "checkbox");
      box.setAttribute("class", "query-filter");
      box.setAttribute("data-field", c.field);
      box.setAttribute("data-value", c.value);
      box.setAttribute("data-op", myOp);
      box.setAttribute("data-feature-name", "search");
      box.setAttribute("checked", "checked");
  
      myLi.appendChild(box);
      myLi.appendChild(label);
      return myLi;
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
  