export const errorHandler = (err) => {
  if(typeof (err.networkError) != 'undefined'
    && typeof (err.networkError.result) != 'undefined'
    && typeof (err.networkError.result.errors) != 'undefined'
    && err.networkError.result.errors.length > 0){

    const errTable = []

    err.networkError.result.errors.forEach(function(e) {
      errTable.push({
        message: e.message,
        stack_trace: e.extensions.exception.stacktrace[0]
      });

      for(let i = 1; i < e.extensions.exception.stacktrace.length; i++){
        errTable.push({
          message: '',
          stack_trace: e.extensions.exception.stacktrace[i]
        });
      }
    });

    console.table(errTable);
  }
}