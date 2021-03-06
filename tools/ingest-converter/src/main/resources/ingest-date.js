/**
 * Converts Ingest Date JSON to LS Date filter.
 */
function ingest_to_logstash_date(json) {

    function map_processor(processor) {

        function date_hash(processor) {
            var date_json = processor["date"];
            var formats = date_json["formats"];
            var match_contents = [IngestConverter.dots_to_square_brackets(date_json["field"])];
            for (var f in formats) {
                match_contents.push(formats[f]);
            }
            var date_contents = IngestConverter.create_field(
                "match",
                IngestConverter.create_pattern_array(match_contents)
            );
            if (date_json["target_field"]) {
                var target = IngestConverter.create_field(
                    "target",
                    IngestConverter.quote_string(
                        IngestConverter.dots_to_square_brackets(date_json["target_field"])
                    )
                );
                date_contents = IngestConverter.join_hash_fields([date_contents, target]);
            }
            if (date_json["timezone"]) {
                var timezone = IngestConverter.create_field(
                    "timezone",
                    IngestConverter.quote_string(date_json["timezone"])
                );
                date_contents = IngestConverter.join_hash_fields([date_contents, timezone]);
            }
            if (date_json["locale"]) {
                var locale = IngestConverter.create_field(
                    "locale", IngestConverter.quote_string(date_json["locale"]));
                date_contents = IngestConverter.join_hash_fields([date_contents, locale]);
            }
            return date_contents;
        }

        return IngestConverter.fix_indent(
            IngestConverter.create_hash(
                "filter",
                IngestConverter.create_hash(
                    "date", date_hash(processor)
                )
            )
        )
    }

    return JSON.parse(json)["processors"].map(map_processor).join("\n\n") + "\n";
}
