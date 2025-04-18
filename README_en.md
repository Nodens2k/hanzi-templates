# hanzi-templates

[Lee esta página en español](./README.md)

Printable template generator for practicing hanzi (Chinese characters) writing.

Helper tool for Chinese students.

Visit tool site at https://nodens2k.github.io/hanzi-templates/hanzi.html

## Usage

Choose the desired cell size for the template. Two options available: 100mm and 17mm.

Write down the template contents, or select one of the predefined ones listed below.

Click on the "Update" (Actualizar) button for refreshing the template content. Clicking the "Copy Link" (Copiar Enlace) button, a
permalink to the current template contents is copied to the clipboard that can be shared with other people.

Once the template is ready, use the Print feature of the browser. Currently, the crossing lines in the cells cannot be printed from
an Android device. To get them printed, use a Computer and make sure that the option to print "background images" is enabled.

Printing to PDF is another great way to share your work with other people.

## Template syntax

Two different syntaxes are supported:
- Pinyin+Hanzi pair syntax
- CSV table syntax

### Pinyin+Hanzi pair syntax

- Each text line translates to a pinyin+hanzi row pair in the generated template
- An empty line is converted into an empty row pair
- Each line is composed of an even number of space-separated words. In each pair of words, the first word is the pinyin
  transcription, and the second one contains the hanzi

For example:
```
ni3 你 hao3 好
```

### CSV-like table syntax

- Each line translates into a template row, alternating between pinyin and hanzi rows
- Cells in each row are delimited by any of the following characters: .,|/
- Space characters and tabs can be used for aligning cells and improve the template readability
- The template must contain at least one of the separator characters for the generator to correctly detect this syntax

The same example as before would be written as:
```
| ni3 | hao3 |
|  你 |  好  |
```
or even:
```
nǐ,hǎo
你，好
```


### Writing pinyin

When writing pinyin, vowels with tone marks can be entered through the pinyin keyboard to the right of the text contents, or alternatively
"tone numbers" can be used. That is, you can either write "hǎo", or "hao3".
