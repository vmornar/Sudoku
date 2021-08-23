var td = null;
var time;
var t;
var tn;
var timerId = null;
var n;
var my, theirs, name;
var ws;

function join() {
    var l = window.location.toString();
    var myname = $("#name").val();
    ws = new WebSocket(l.replace("http://", "ws://") + "sudokusocket/" + myname);
    ws.onmessage = function (msg) {
        var cmd = JSON.parse(msg.data);
        if (cmd.command == "gen") {
            draw(cmd.puzzle);
            validate(null);
        } else {
            let s = "";
            for (let k of Object.keys(cmd.res)) {
                s += k + ":" + cmd.res[k] + " ";
            }
            console.dir("Message", s);
            $("#res").html(s);
        }
    }
    $("#namediv").toggle();
    $("#gendiv").toggle();
}

function timer() {
    time++;
    $("#time").html(Math.floor(time / 60) + ":" + ("00" + time % 60).slice(-2));
}

function draw(r) {
    k = 0;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            t.rows[i].cells[j].style.backgroundColor = "white";
            cell = r[k] == 0 ? ' ' : r[k];
            t.rows[i].cells[j].innerHTML = cell;
            t.rows[i].cells[j].init = cell != ' ';
            ++k;
        }
    }
    time = 0;
    if (timerId != null) clearInterval(timerId);
    timerId = setInterval(timer, 1000);
    td = null;
}

function start(gen) {
    if (gen == 1) {
        gen = $("#perc").val();
    }
    let cmd = {};
    cmd["command"] = "gen";
    cmd["difficulty"] = gen;
    ws.send(JSON.stringify(cmd));
    return;

    $.get("sudoku/puzzle?gen=" + gen, function (data, status) {
        var r = JSON.parse(data);
        k = 0;
        for (i = 0; i < 9; i++) {
            for (j = 0; j < 9; j++) {
                t.rows[i].cells[j].style.backgroundColor = "white";
                cell = r[k] == 0 ? ' ' : r[k];
                t.rows[i].cells[j].innerHTML = cell;
                t.rows[i].cells[j].init = cell != ' ';
                ++k;
            }
        }
        time = 0;
        if (timerId != null) clearInterval(timerId);
        timerId = setInterval(timer, 1000);
        td = null;
    });

}

function validate(td) {
    res = true;
    a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            t.rows[i].cells[j].style.backgroundColor = "white";
            val = t.rows[i].cells[j].innerHTML;
            if (val >= 1) {
                a[val]++;
            }
        }
    }

    for (i = 1; i < 10; i++) {
        if (a[i] == 9) {
            tn.rows[0].cells[i - 1].style.backgroundColor = "gray";
        }
    }
    if (td == null) return;
    for (i = 0; i < 9; i++) {
        a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (j = 0; res && j < 9; j++) {
            //t.rows[i].cells[j].style.backgroundColor = "white";
            val = t.rows[i].cells[j].innerHTML;
            if (val >= 1) {
                a[val]++;
                if (a[val] > 1) {
                    td.css("background-color", "red");
                    //t.rows[i].cells[j].style.backgroundColor = "red";
                    res = false;
                }
            }
        }
    }

    for (j = 0; j < 9; j++) {
        a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; res && i < 9; i++) {
            val = t.rows[i].cells[j].innerHTML;
            if (val >= 1) {
                a[val]++;
                if (a[val] > 1) {
                    td.css("background-color", "red");
                    //t.rows[i].cells[j].style.backgroundColor = "red";
                    res = false;
                }
            }
        }
    }

    for (x = 0; x < 9; x += 3) {
        for (y = 0; res && y < 9; y += 3) {
            a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = x; i < x + 3; i++) {
                for (j = y; j < y + 3; j++) {
                    val = t.rows[i].cells[j].innerHTML;
                    if (val >= 1) {
                        a[val]++;
                        if (a[val] > 1) {
                            td.css("background-color", "red");
                            //t.rows[i].cells[j].style.backgroundColor = "red";
                            res = false;
                        }
                    }
                }
            }

        }
    }

    full = true;
    n = 0;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (t.rows[i].cells[j].innerHTML == ' ') {
                n++;
                full = false;
            }
        }
    }

    let cmd = {};
    cmd["command"] = "res";
    cmd["res"] = res ? n : -n;
    console.dir("Sending ", cmd, res, n);
    ws.send(JSON.stringify(cmd));

    if (full && res) {
        for (i = 0; i < 9; i++) {
            for (j = 0; j < 9; j++) {
                t.rows[i].cells[j].style.backgroundColor = "green";
                clearInterval(timerId);
            }
        }
        // if (res) {
        //     t.bgColor = "green";
        // } else {
        //     t.bgColor = "red";

        // }
    }
}

window.onload = function () {
    t = $("#puzzle")[0];
    tn = $("#numbers")[0];
    $("#namediv").toggle();
    $('td').click(function () {
        table = $(this).closest("table");
        if (table.attr("id") == "puzzle") {
            if (td != null) {
                td.css("background-color", "white");
            }
            td = $(this);
            if (td[0].init) {
                td = null;
                return;
            }
            $(this).css("background-color", "lightgray");
            // col = $(this).closest("td").index();
            // row = $(this).closest("tr").index();
        } else {
            if (td != null) {
                td.html($(this).html());
                td.css("background-color", "white");
                validate(td);
            }
        }
    });
}