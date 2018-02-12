var mysql      = require('mysql');
var fs = require('fs');
var connection = mysql.createConnection({
/*   host    ,
     user    ,
     password,
     database */
});
 
connection.connect();
const set = new Set();
[
  {"route": 1, "direction": "Northbound"},
  {"route": 1, "direction": "Southbound"},
  {"route": 102, "direction": "Eastbound"},
  {"route": 102, "direction": "Westbound"},
  {"route": 104, "direction": "Northbound"},
  {"route": 104, "direction": "Southbound"},
  {"route": 107, "direction": "Eastbound"},
  {"route": 107, "direction": "Westbound"},
  {"route": 109, "direction": "Northbound"},
  {"route": 109, "direction": "Southbound"},
  {"route": 110, "direction": "Northbound"},
  {"route": 110, "direction": "Southbound"},
  {"route": 114, "direction": "Northbound"},
  {"route": 114, "direction": "Southbound"},
  {"route": 115, "direction": "Eastbound"},
  {"route": 115, "direction": "Westbound"},
  {"route": 117, "direction": "Northbound"},
  {"route": 117, "direction": "Southbound"},
  {"route": 119, "direction": "Eastbound"},
  {"route": 119, "direction": "Westbound"},
  {"route": 12, "direction": "Northbound"},
  {"route": 12, "direction": "Southbound"},
  {"route": 120, "direction": "Eastbound"},
  {"route": 120, "direction": "Westbound"},
  {"route": 121, "direction": "Northbound"},
  {"route": 121, "direction": "Southbound"},
  {"route": 123, "direction": "Northbound"},
  {"route": 123, "direction": "Southbound"},
  {"route": 124, "direction": "Eastbound"},
  {"route": 124, "direction": "Westbound"},
  {"route": 125, "direction": "Northbound"},
  {"route": 125, "direction": "Southbound"},
  {"route": 126, "direction": "Eastbound"},
  {"route": 126, "direction": "Westbound"},
  {"route": 13, "direction": "Eastbound"},
  {"route": 13, "direction": "Westbound"},
  {"route": 132, "direction": "Northbound"},
  {"route": 132, "direction": "Southbound"},
  {"route": 140, "direction": "Northbound"},
  {"route": 140, "direction": "Southbound"},
  {"route": 141, "direction": "Northbound"},
  {"route": 141, "direction": "Southbound"},
  {"route": 15, "direction": "Northbound"},
  {"route": 15, "direction": "Southbound"},
  {"route": 150, "direction": "Eastbound"},
  {"route": 150, "direction": "Westbound"},
  {"route": 153, "direction": "Northbound"},
  {"route": 153, "direction": "Southbound"},
  {"route": 16, "direction": "Northbound"},
  {"route": 16, "direction": "Southbound"},
  {"route": 162, "direction": "Eastbound"},
  {"route": 162, "direction": "Westbound"},
  {"route": 165, "direction": "Northbound"},
  {"route": 165, "direction": "Southbound"},
  {"route": 172, "direction": "Northbound"},
  {"route": 172, "direction": "Southbound"},
  {"route": 178, "direction": "Northbound"},
  {"route": 178, "direction": "Southbound"},
  {"route": 180, "direction": "Northbound"},
  {"route": 180, "direction": "Southbound"},
  {"route": 181, "direction": "Northbound"},
  {"route": 181, "direction": "Southbound"},
  {"route": 183, "direction": "Eastbound"},
  {"route": 183, "direction": "Westbound"},
  {"route": 185, "direction": "Northbound"},
  {"route": 185, "direction": "Southbound"},
  {"route": 186, "direction": "Eastbound"},
  {"route": 186, "direction": "Westbound"},
  {"route": 189, "direction": "Northbound"},
  {"route": 189, "direction": "Southbound"},
  {"route": 19, "direction": "Northbound"},
  {"route": 19, "direction": "Southbound"},
  {"route": 191, "direction": "Northbound"},
  {"route": 191, "direction": "Southbound"},
  {"route": 192, "direction": "Northbound"},
  {"route": 192, "direction": "Southbound"},
  {"route": 193, "direction": "Northbound"},
  {"route": 193, "direction": "Southbound"},
  {"route": 194, "direction": "Northbound"},
  {"route": 194, "direction": "Southbound"},
  {"route": 195, "direction": "Eastbound"},
  {"route": 195, "direction": "Westbound"},
  {"route": 196, "direction": "Northbound"},
  {"route": 196, "direction": "Southbound"},
  {"route": 2, "direction": "Eastbound"},
  {"route": 2, "direction": "Westbound"},
  {"route": 21, "direction": "Eastbound"},
  {"route": 21, "direction": "Westbound"},
  {"route": 24, "direction": "Eastbound"},
  {"route": 24, "direction": "Westbound"},
  {"route": 25, "direction": "Northbound"},
  {"route": 25, "direction": "Southbound"},
  {"route": 26, "direction": "Eastbound"},
  {"route": 26, "direction": "Westbound"},
  {"route": 27, "direction": "Northbound"},
  {"route": 27, "direction": "Southbound"},
  {"route": 3, "direction": "Eastbound"},
  {"route": 3, "direction": "Westbound"},
  {"route": 30, "direction": "Eastbound"},
  {"route": 30, "direction": "Westbound"},
  {"route": 32, "direction": "Northbound"},
  {"route": 32, "direction": "Southbound"},
  {"route": 33, "direction": "Northbound"},
  {"route": 33, "direction": "Southbound"},
  {"route": 34, "direction": "Northbound"},
  {"route": 34, "direction": "Southbound"},
  {"route": 36, "direction": "Eastbound"},
  {"route": 36, "direction": "Westbound"},
  {"route": 37, "direction": "Eastbound"},
  {"route": 37, "direction": "Westbound"},
  {"route": 39, "direction": "Northbound"},
  {"route": 39, "direction": "Southbound"},
  {"route": 4, "direction": "Northbound"},
  {"route": 4, "direction": "Southbound"},
  {"route": 40, "direction": "Northbound"},
  {"route": 40, "direction": "Southbound"},
  {"route": 42, "direction": "Northbound"},
  {"route": 42, "direction": "Southbound"},
  {"route": 47, "direction": "Northbound"},
  {"route": 47, "direction": "Southbound"},
  {"route": 49, "direction": "Northbound"},
  {"route": 49, "direction": "Southbound"},
  {"route": 5, "direction": "Northbound"},
  {"route": 5, "direction": "Southbound"},
  {"route": 50, "direction": "Eastbound"},
  {"route": 50, "direction": "Westbound"},
  {"route": 51, "direction": "Eastbound"},
  {"route": 51, "direction": "Westbound"},
  {"route": 53, "direction": "Eastbound"},
  {"route": 53, "direction": "Westbound"},
  {"route": 55, "direction": "Northbound"},
  {"route": 55, "direction": "Southbound"},
  {"route": 56, "direction": "Eastbound"},
  {"route": 56, "direction": "Westbound"},
  {"route": 58, "direction": "Eastbound"},
  {"route": 58, "direction": "Westbound"},
  {"route": 6, "direction": "Northbound"},
  {"route": 6, "direction": "Southbound"},
  {"route": 60, "direction": "Northbound"},
  {"route": 60, "direction": "Southbound"},
  {"route": 66, "direction": "Northbound"},
  {"route": 66, "direction": "Southbound"},
  {"route": 67, "direction": "Eastbound"},
  {"route": 67, "direction": "Westbound"},
  {"route": 68, "direction": "Eastbound"},
  {"route": 68, "direction": "Westbound"},
  {"route": 71, "direction": "Eastbound"},
  {"route": 71, "direction": "Westbound"},
  {"route": 73, "direction": "Northbound"},
  {"route": 73, "direction": "Southbound"},
  {"route": 74, "direction": "Eastbound"},
  {"route": 74, "direction": "Westbound"},
  {"route": 75, "direction": "Northbound"},
  {"route": 75, "direction": "Southbound"},
  {"route": 78, "direction": "Eastbound"},
  {"route": 78, "direction": "Westbound"},
  {"route": 79, "direction": "Northbound"},
  {"route": 79, "direction": "Southbound"},
  {"route": 8, "direction": "Northbound"},
  {"route": 8, "direction": "Southbound"},
  {"route": 81, "direction": "Northbound"},
  {"route": 81, "direction": "Southbound"},
  {"route": 82, "direction": "Eastbound"},
  {"route": 82, "direction": "Westbound"},
  {"route": 823, "direction": "Northbound"},
  {"route": 823, "direction": "Southbound"},
  {"route": 83, "direction": "Eastbound"},
  {"route": 83, "direction": "Westbound"},
  {"route": 84, "direction": "Eastbound"},
  {"route": 84, "direction": "Westbound"},
  {"route": 86, "direction": "Eastbound"},
  {"route": 86, "direction": "Westbound"},
  {"route": 865, "direction": "Eastbound"},
  {"route": 865, "direction": "Westbound"},
  {"route": 87, "direction": "Northbound"},
  {"route": 87, "direction": "Southbound"},
  {"route": 89, "direction": "Northbound"},
  {"route": 89, "direction": "Southbound"},
  {"route": 9, "direction": "Northbound"},
  {"route": 9, "direction": "Southbound"},
  {"route": 93, "direction": "Eastbound"},
  {"route": 93, "direction": "Westbound"},
  {"route": 94, "direction": "Northbound"},
  {"route": 94, "direction": "Southbound"},
  {"route": 95, "direction": "Northbound"},
  {"route": 95, "direction": "Southbound"},
  {"route": 99, "direction": "Northbound"},
  {"route": 99, "direction": "Southbound"}
].forEach(_=>{
  set.add(_.route);
})

 const query = function (query) {
  const promise = new Promise((resolve, reject)=>{
    connection.query(query, function (error, results, fields) {
       if (error) reject(error);
       resolve(results, fields);
     });
  });
  return promise;
 }


var count = {};
var shapes = {};

async function getShape(r) {
  // Get table id for the requested route 'r'
  const r_id =  await query(`SELECT route_id FROM ROUTES WHERE route_short_name = ${r}`);
  // Get related shape_id
  const sh_id = await query(`SELECT DISTINCT shape_id, direction_id, trip_headsign FROM TRIPS WHERE route_id = ${r_id[0].route_id}`);

  // console.log({r_id, sh_id});
  const i = `${r}`;
  for(const _ of sh_id){
    const shape = await query(`SELECT COUNT(*) as total FROM SHAPES WHERE shape_id = ${_.shape_id}`);
      count[i]++ || (count[i] = 1 );
      if(shapes[i]) (shapes[i][1] < shape[0].total) ? (shapes[i]=[_.shape_id, shape[0].total, _.trip_headsign]) : 0;
      else shapes[i] = [_.shape_id, shape[0].total, _.trip_headsign];
  }
  const shape = await query(`SELECT shape_pt_lat as lat, shape_pt_lon as lng FROM SHAPES WHERE shape_id = ${shapes[i][0]}`)
  return new Promise((res,rej) => {
    fs.writeFile(`shapes/${i}.json`, JSON.stringify(shape),(err) => err ? rej() : res());
  });
}
  

Promise.all(Array.from(set).map(r=>
  getShape(r)
)).then(_=>console.log({result:_, count, shapes})||connection.end());

