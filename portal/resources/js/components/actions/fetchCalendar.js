// action that create calendar store based on plans and ongoing and planned operations
const fetchCalendar = (plans,ongoing,planned) => {
  return function (dispatch,getState) {
    _.forEach(plans, function (value, key) {
      value.start = new Date(value.start_date);
      value.end =  new Date(value.stop_date);
      value.plan = true;
      value.id_id = _.uniqueId('plan_');
    })
    _.forEach(ongoing, function (value, key) {
      value.start = new Date(value.planned_date);
      value.end =  new Date(value.planned_date);
      value.id_id = _.uniqueId('ongoing_');
    })
    _.forEach(planned, function (value, key) {
      value.start = new Date(value.planned_date);
      value.end =  new Date(value.planned_date);
      value.id_id = _.uniqueId('planned_');
    })
    dispatch({type: 'setOperations',calendar:[...plans, ...ongoing,...planned ]})
  }
}
export default fetchCalendar;

