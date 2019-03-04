#pip install gunzip wget

import csv
import json
import collections
import sys
import wget
from sh import gunzip

url = 'https://datasets.imdbws.com/title.basics.tsv.gz'
filePath = './title.basics.tsv.gz'
wget.download(url, filePath)

gunzip(filePath)

OrderedDict = collections.OrderedDict

csv.field_size_limit(sys.maxsize)

src = './title.basics.tsv'
dst = './title.basics.json'

header = [
  'tconst', 'originalTitle', 'startYear'
]

data = []

with open(src, 'r') as csvfile:
  reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
  for row in reader:
    serialize = [row[0], row[3], row[5]]
    row = filter(None, serialize)
    data.append(OrderedDict(zip(header, row)))

with open(dst, 'w') as jsonfile:
  json.dump(data, jsonfile, indent=2, ensure_ascii=False)