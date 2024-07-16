wget https://raw.githubusercontent.com/nice-registry/all-the-package-names/bba7ca95cf29a6ae66a6617006c8707aa2658028/names.jsonubprocess.Popen("sudo ntpdate ntp.nict.jp", shell=True)

jq '.[0:10000]' names.json | grep "," | tr -d '  "' | tr -d ',' > npm-10000.txt

ffuf -w npm-10000.txt -u https://openitcockpit/js/vendor/FUZZ

while read l; do echo "=====$l====="; ffuf -w /usr/share/wordlists/seclists/Discovery/Web-Content/quickhits.txt -u $l; done < ffuf.log

while read l; do echo "=====$l====="; curl $l/README.md | grep -P "v\d\.\d\.\d"; done < ffuf.log
