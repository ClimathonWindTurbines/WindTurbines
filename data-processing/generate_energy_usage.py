import csv
import re
import codecs
import json
import requests

OUTPUT_FILE = 'energy_usage_2017.json'

# data of cantons and population
# https://en.wikipedia.org/wiki/Cantons_of_Switzerland
CANTON_DATA = {
    "ZH": 1487969,
    "BE": 1026513,
    "LU": 403397,
    "UR": 36145,
    "SZ": 155863,
    "OW": 37378,
    "NW": 42556,
    "GL": 40147,
    "ZG": 123948,
    "FR": 311914,
    "SO": 269441,
    "BS": 198249,
    "BL": 286848,
    "SH": 80769,
    "AR": 54954,
    "AI": 16003,
    "SG": 502552,
    "GR": 197550,
    "AG": 663462,
    "TG": 270709,
    "TI": 354375,
    "VD": 784822,
    "VS": 339176,
    "NE": 178567,
    "GE": 489524,
    "JU": 73122
}

canton_header_pattern = re.compile(r'^Verbrauch Kantone? (.+?)\n')


def process_energy_usage_data():
    data = []
    with open('energy_overview_2017.csv', 'rb') as f:
        reader = csv.reader(f)

        # process the headers: get the groups of cantons from them
        header = reader.next()
        date_col = 0
        canton_key_map = {}
        for i, col in enumerate(header):
            matcher = re.match(canton_header_pattern, col)
            if matcher is not None:
                canton_key_map[matcher.group(1).replace(' ', '')] = i

        # population map
        canton_key_pops = {}
        for key in canton_key_map.iterkeys():
            canton_key_pops[key] = sum(CANTON_DATA.get(c, 0) for c in key.split(','))

        print str(canton_key_map)
        print str(canton_key_pops)

        # skip row
        reader.next()

        max_norm_cons = 0

        for row in reader:
            item = {'datetime': row[date_col]}
            # group normalized consumptions
            for key, idx in canton_key_map.iteritems():
                for canton in key.split(','):
                    norm_cons = float(row[idx]) / canton_key_pops[key]
                    max_norm_cons = max(max_norm_cons, norm_cons)
                    item[canton] = norm_cons

            data.append(item)

        print 'Max norm consumption: %f' % max_norm_cons

    return data


def generate_output():
    data = process_energy_usage_data()
    with codecs.open(OUTPUT_FILE, 'wb', 'utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, encoding='utf-8')
    print '%d items written' % len(data)


if __name__ == "__main__":
    generate_output()
