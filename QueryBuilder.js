//
class QueryBuilder {
    constructor(qry) {
      this.internalQuery = qry;
    }
  
    /**
     *
     * @param {*} qb
     */
    render(locale) {
      let container = document.getElementById(locale);
  
      let checkboxes = [];
      checkboxes = this.internalQuery.where.map(this.conditionToCheckbox);
      checkboxes.push(this.limitToCheckbox(this.internalQuery.limit));
  
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
      //console.log(this.internalQuery);
      // contactQuery(this.internalQuery);
      // Trigger a new customevent object and use the
      // onQueryUpdate hook to execute contactQuery()
      let queryChanged = new CustomEvent('querychange', {
          detail: this.internalQuery
      });
      document.dispatchEvent(queryChanged);
    }
  
    addCondition(c) {
      this.internalQuery.where.push(c);
    }
  
    removeCondition(c) {
      let newWhere = this.internalQuery.where.filter((cond) => {
        //remove equivalent fields from where
        if (c.field == cond.field && c.value == cond.value) {
          return false;
        }
        return true;
      });
      this.internalQuery.where = newWhere;
    }
    getObject() {
      return this.internalQuery;
    }
    conditionToCheckbox(c) {
      // Create li elements; each li will have a <label> and <input type="checkbox"> element as "children."
      let myLi = document.createElement("li");
      let myOp = c.op || this.SQL_EQ;
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
  