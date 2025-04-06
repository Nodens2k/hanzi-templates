import $ from 'https://cdn.skypack.dev/jquery';
import './insert-at-caret.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const dbUrl = "https://xihovlvpwltfvmuljbsi.supabase.co";
const publicKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaG92bHZwd2x0ZnZtdWxqYnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNDgxNDksImV4cCI6MjA1ODgyNDE0OX0.nqScDXbus4TXju3q0ZxpoAoit-cT3s5p7u7U0HNr57w";
const supabase = createClient(dbUrl, publicKey);

export function Template(id, label, contents) {
    this.id = id;
    this.label = label;
    this.contents = contents;
}

export class HanziGrid {
    
    update() {
        console.debug("Grid updated");
        var tableClass = $("#grid-size").val();
        var CELLS = 5;
        if (tableClass === "grid-10mm") {
            CELLS = 17;
        } else if (tableClass === "grid-17mm") {
            CELLS = 10;
        }

        var tbody, i, j, k, n, mod, contents;
        var contents = $("#hanzis").val();
        contents = this.translateNumericTones(contents);
        contents = this.translateNewSyntax(contents);
        var lines = contents.split(/\n/);

        tbody = $("#t tbody");
        tbody.empty();
        for (i = 0; i < lines.length; i++) {
            contents = lines[i].trim().split(/[ \t]+/);

            var row1 = "<tr class='pinyin'>";
            var row2 = "<tr class='hanzi'>";
            if (contents.length == 0) {
                for (j = 0; j < CELLS; j++) {
                    row1 += "<td>";
                    row2 += "<td>";
                }
            } else {
                mod = contents.length;
                n = mod == 2 ? 5 : (mod / 2) * 3;
                for (j = 0; j < CELLS; j++) {
                    var pinyin = contents[(2 * j + 0) % mod];
                    var hanzi  = contents[(2 * j + 1) % mod];
                    var tag = j < (mod / 2) ? "<td class='black'>" : "<td>";
                    row1 += tag + pinyin;
                    row2 += tag + (j < n ? hanzi : ' ');
                }
            }
            tbody.append(row1, row2);
        }
    }
    translateNumericTones(s) {
        
        const tonos = {
            'a': ['ā', 'á', 'ǎ', 'à'],
            'e': ['ē', 'é', 'ě', 'è'],
            'i': ['ī', 'í', 'ǐ', 'ì'],
            'o': ['ō', 'ó', 'ǒ', 'ò'],
            'u': ['ū', 'ú', 'ǔ', 'ù'],
            'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
        };

        return s.replace(/([a-zü]+)([1-4])/gi, function(match, syllable, tone) {
            let vowel = '';
            if (syllable.includes('a')) {
                vowel = 'a';
            } else if (syllable.includes('e')) {
                vowel = 'e';
            } else if (syllable.includes('ou')) {
                vowel = 'o';
            } else {
                const vowels = ['i', 'o', 'u', 'ü'];
                for (let v of vowels) {
                if (syllable.includes(v)) {
                    vowel = v;
                    break;
                }
                }
            }
            return syllable.replace(vowel, tonos[vowel][tone - 1]);
        });
    }
    translateNewSyntax(s) {
        if (!/.*[\.,|/，。].*/.test(s)) {
            // Sintaxis original
            return s;
        }

        // Sintaxis de tabla markdown
        const separator = /\s*[\.,|/，。]\s*/;
        var translated = '';
        var lines = s.split(/\n/);
        for (var i = 0; i < lines.length; i+= 2) {
            var row_pinyin = lines[i].split(separator);
            var row_hanzis = lines[i+1].split(separator);
            var cells = Math.min(row_pinyin.length, row_hanzis.length);
            for (var j = 0; j < cells; j++) {
                translated += row_pinyin[j] + ' ' + row_hanzis[j] + ' ';
            }
            translated += '\n';
        }
        console.log("translated to: ", translated);
        return translated.substring(0, translated.length - 1);
    }
}

export class TemplateEditor {
    offlineTemplates = [];
    grid = new HanziGrid();

    updateTemplate(elem) {
        var id = elem.id;
        var template = $(elem).data("template");
        $("#hanzis").val(template.contents);
        this.grid.update();
    }

    initTemplates(templates) {
        var self = this;
        var root = $("templates");
        root.empty();
        for (var i = 0; i < templates.length; i++) {
            var id = templates[i].id;
            var label = templates[i].label;
            root.append("<br><button class='template' id='" + id + "'>" + label + "</button>");
            $("#" + id).data("template", templates[i]);
        }
        $(".template").click(function() {
            self.updateTemplate(this);
        });
    }

    async loadTemplates(mergeOffline) {
        var query = supabase.from("templates").select("id,name,contents").order("order");
        const {data, error} = await query;
        if (error) {
            console.error(error);
            this.initTemplates(this.offlineTemplates);
        } else {
            var templates = new Array(data.length);
            var map = {};
            for (var i = 0; i < data.length; i++) {
                const d = data[i];
                templates[i] = new Template(d.id, d.name, d.contents);
                map[d.id] = true;
            }
            if (mergeOffline) {
                this.offlineTemplates.forEach(function(item) {
                    if (!map[item.id]) {
                        templates.push(item);
                    }
                })
            }
            this.initTemplates(templates);
        }
    }

    init(mergeOffline) {
        const self = this;
        $(document).ready(async function() {
            const gridSelector = $("#grid-size");
            const editor = $("#hanzis");
            const btnUpdate = $("#btnUpdate");
            const btnPrint = $("#btnPrint");
            const btnShare = $("#btnShare");

            // Prevent form submit
            $("form").submit(function (e) { e.preventDefault(); });

            // Show/Hide settings panel
            $("#settings").click(function(event) {
                if (event.target === this) {
                    $(this).removeClass("visible");
                }
            });
            $("#menu-icon").click(function() {
                $("#settings").addClass("visible");
            })
            btnUpdate.click(function() {
                self.grid.update();
            });
            btnPrint.click(function() {
                window.print();
            });
            btnShare.click(function() {
                var text = editor.val();
                var gridSize = gridSelector.val();

                var url = window.location.origin + window.location.pathname + "?size=" + gridSize + "&hanzis=" + encodeURIComponent(text);
                navigator.clipboard.writeText(url);
                console.debug("Link copied to clipboard: " + url);
            });

            gridSelector.change(function() {
                var klass = $(this).val();
                $("#t").attr("class", klass);
                self.grid.update();
            });
            $("#btnReload").click(function() {
                self.loadTemplates(mergeOffline);
            });

            await self.loadTemplates(mergeOffline);
            
            var query = window.location.search;
            var params = new URLSearchParams(query);
            if (params.has("size")) {
                var size = params.get("size").includes("17") ? "grid-17mm" : "grid-10mm";
                $("#grid-size").val(size);
            }
            if (params.has("hanzis")) {
                var text = params.get("hanzis");
                $("#hanzis").val(text);
                $("#btnUpdate").click();
            } else {
                $(".template:first-of-type").click();
            }
            $("#settings").addClass("visible");
            
            var hanzis = editor[0];
            var codeMirror = CodeMirror.fromTextArea(hanzis, {
                lineNumbers: true,
                mode: "javascript",
                indentWithTabs: true,
                tabSize: 7,
                indentUnit: 7,
                value: hanzis.textContent
            });
            codeMirror.on("blur", function() {
                editor.val(codeMirror.getValue());
            });

            // Special character buttons
            $("keyboard button").click(function() {
                var letter = $(this).text();
                codeMirror.replaceSelection(letter);
            });
        });
    }
}
