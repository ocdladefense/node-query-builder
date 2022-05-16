//
class QueryBuilder {
  constructor(usrQry) {
    //query building
    this.SQL_EQ = "=";
    this.SQL_LIKE = "LIKE";
    this.SQL_GT = ">";
    this.SQL_LT = "<";

    this.userQuery = usrQry;
  }

  /**
   *
   * @param {*} qb
   */
  render(qb) {
    let container = document.getElementById("custom");

    let checkboxes = [];
    checkboxes = this.userQuery.where.map(this.conditionToCheckbox);
    checkboxes.push(this.limitToCheckbox(this.userQuery.limit));

    // Add the created li's (from above) to the current document.
    checkboxes.forEach((checkbox) => {
      container.appendChild(checkbox);
    });
  }

  // For example, onQueryUpdate(contactQuery) would
  // execute the contactQuery function each time the query is updated.
  onQueryUpdate(fn) {
    // execute fn when the query is updated.
    fn();
  }

  getBox(box) {
    console.log(box);

    let field = box.dataset.field;
    let value = box.dataset.value;
    let op = box.dataset.op;

    let cond = {
      field: field,
      value: value,
      op: op,
    };

    if (box.checked == true) {
      this.userQuery.where.push(cond);
    } else {
      let newWhere = this.userQuery.where.filter((c) => {
        //unchecked
        if (c.field == cond.field && c.value == cond.value) {
          return false;
        }
        return true;
      });
      this.userQuery.where = newWhere;
    }
    //console.log(this.userQuery);
    // contactQuery(this.userQuery);
    // Trigger a new customevent object and use the
    // onQueryUpdate hook to execute contactQuery()
  }

  addCondition(c) {
    this.userQuery.where.push(c);
  }

  removeCondition(c) {
    this.userQuery.where.filter((cond) => {
      //unchecked
      if (c.field == cond.field && c.value == cond.value) {
        return false;
      }
      return true;
    });
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
