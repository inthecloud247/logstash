package org.logstash.ingest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

/**
 * Ingest JSON DSL to Logstash Grok Transpiler.
 */
public final class Grok {

    private Grok() {
        // Utility Wrapper for JS Script.
    }

    public static void main(final String... args) throws ScriptException, NoSuchMethodException {
        try {
            final ScriptEngine engine = JsUtil.engine("/ingest-grok.js");
            Files.write(Paths.get(args[1]), ((String) ((Invocable) engine).invokeFunction(
                "ingest_to_logstash_grok",
                new String(
                    Files.readAllBytes(Paths.get(args[0])), StandardCharsets.UTF_8
                )
            )).getBytes(StandardCharsets.UTF_8));
        } catch (final IOException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
