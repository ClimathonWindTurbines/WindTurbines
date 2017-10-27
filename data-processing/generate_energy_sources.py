import csv
import codecs
import json
import requests

OUTPUT_FILE = 'energy_source_locations.json'


def convert_swiss_coords_latlon(ch_x, ch_y):
    r = requests.get(
        'http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=%s&northing=%s&format=json' % (ch_x, ch_y))
    if r.status_code == 200:
        rsp = r.json()
        return float(rsp['northing']), float(rsp['easting'])
    return None, None


def get_wind_turbines():
    data = []
    with open('wind-turbines.json', 'rb') as f:
        rdata = json.load(f)
        plants = rdata['DATASECTION']['Windenergyplants_V1.Plant']['Windenergyplants_V1.Plant.Facility']
        for plant in plants:
            coords = plant['position']['COORD']
            lat, lon = convert_swiss_coords_latlon(coords['C1'], coords['C2'])
            item = {
                'type': 'wind',
                'name': plant['name'],
                'latitude': lat,
                'longitude': lon,
                'power_output_kw': float(plant['ratedPower'])
            }
            data.append(item)
            print 'wind: %d/%d' % (len(data), len(plants))
    return data


def get_water_plants():
    data = []
    with open('Wasserkraftanlagen-2016.csv', 'rb') as f:
        reader = csv.DictReader(f)
        for row in reader:
            ch_x = float(row['ZE-Koordinaten unscharf (Ost)']) + 2000000
            ch_y = float(row['ZE-Koordinaten unscharf (Nord)']) + 1000000
            lat, lon = convert_swiss_coords_latlon(ch_x, ch_y)
            item = {
                'type': 'water',
                'name': row['ZE-Name'].decode('utf-8'),
                'latitude': lat,
                'longitude': lon,
                'power_output_kw': float(row['Max. Leistung ab Generator'])
            }
            data.append(item)
            print 'water: %d/...' % len(data)
    return data


def get_nucler_plants():
    data = []
    with open('nuclear-plants.json', 'rb') as f:
        rdata = json.load(f)
        plants = rdata['DATASECTION']['NuclearPowerPlants_V1_1.NuclearPowerPlants_WithOneState']
        locs = plants['NuclearPowerPlants_V1_1.NuclearPowerPlants_WithOneState.NuclearPowerPlant']
        reactors = plants['NuclearPowerPlants_V1_1.NuclearPowerPlants_WithOneState.NuclearPowerReactor']
        for loc, reactor in zip(locs, reactors):
            coords = loc['Location']['COORD']
            lat, lon = convert_swiss_coords_latlon(coords['C1'], coords['C2'])
            item = {
                'type': 'nuclear',
                'name': loc['Name'],
                'latitude': lat,
                'longitude': lon,
                'power_output_kw': float(reactor['GrossElectricalOutput'])
            }
            data.append(item)
            print 'nuclear: %d/%d' % (len(data), len(locs))
    return data


def generate_output():
    data = get_wind_turbines() + get_water_plants() + get_nucler_plants()
    with codecs.open(OUTPUT_FILE, 'wb', 'utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, encoding='utf-8')
    print '%d items written' % len(data)


if __name__ == "__main__":
    generate_output()
