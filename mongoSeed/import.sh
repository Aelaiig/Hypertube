while true
do
    echo "Launching imdbId refresh"
    wget -P /mongoSeed/ 'https://datasets.imdbws.com/title.basics.tsv.gz'
    gunzip '/mongoSeed/title.basics.tsv.gz'
    mongoimport --host database --db Hypertube24 --collection imdbId --type tsv --drop --file /mongoSeed/title.basics.tsv --headerline
    rm '/mongoSeed/title.basics.tsv'
    echo "Sleeping 30 minutes until next launch"
    sleep 1800
done