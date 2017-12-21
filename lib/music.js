let all_notes = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'Db'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D', 'Eb'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F', 'F#'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G', 'Ab'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb']
};

let prep = (line) => {
    return line.replace(/{{[^}]+}}/g, (match) => {
              let chords = match.slice(2,-2);
              let topchord = chords.split("/")[0];
              let rootchord = chords.split("/")[1];
              let res =  chord(topchord, rootchord) ;
              return res;
            }).replace(/\[\[[^\]]+\]\]/g, (match) => {
              return notes(match.slice(2,-2));
            })
};

let translate = (num) => {
  return all_notes[song_key][num-1]
};

let chord = (num, root) => {
    let rootchord = "";

    let topchord = translate(num);
    if (num == 3 || num == 6 || num == 2) {
      topchord += "m";
    }
    if (root) {
      rootchord = translate(root);
      rootchord = "/" + rootchord;
    }
    return "<span class='chord'>"+topchord+rootchord+"</span>";
  }
let notes = (str) =>{
  return "<span class='notes-wrap'><span class='notes'>"+str+"</span></span>";
};

let vex = (data, width) => {
  document.write(`<div class="vex-tabdiv" width=${width || 800}>
        options space=0 scale=0.7
        tabstave
        notation=true
        tablature=false
        key=${song_key}
        ${data}
        options space=5
    </div>`);
}

let key_sig = () => {
  document.write("<span class='key'>")
  vex("", 100)
  document.write("</span>");
};

let header = (props) =>{
  document.write(`<header>
    <h1>${props.title} <small>${props.by}</small></h1>
    <div class='tempo'>${props.tempo}</div>
  </header>`);
};

let section = (name, contents, classes) => {
  document.write(`<div class='section ${classes}'>
    <div class='rotate'>${name}</div>`);
    let  lines = contents.split("\n").map( (line) => {
      line = line.trim();
      if (line.match(/^notes /)) {
        vex(line.replace(/{{\d+}}/g, (match) => {
          return translate(parseInt(match.slice(2,-2), 10));
        }));
      } else {
        if (line.length > 0) {
          document.write("<div class='line'>");
          document.write(prep(line));
          document.write("</div>");
        }
      }
    });

  document.write("</div>");
}

let order = (...arguments) => {
  if (arguments.length > 0) {
    document.write("<ul class='order'>");
    arguments.forEach((arg) => {
      document.write("<li>" + prep(arg) +"</li>");
    });
    document.write("</ul>");
  }
};
