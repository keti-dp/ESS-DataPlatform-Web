import os
from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer
from .models import EssMonitoringLog

ESS_MONITORING_LOG_INDEX = Index(os.getenv("ESS_MONITORING_LOG_INDEX"))
ESS_MONITORING_LOG_INDEX.settings(number_of_shards=1, number_of_replicas=1)

# Official document example - custom analyzers
html_strip = analyzer(
    "html_strip",
    tokenizer="standard",
    filter=["lowercase", "stop", "snowball"],
    char_filter=["html_strip"],
)


@registry.register_document
@ESS_MONITORING_LOG_INDEX.doc_type
class EssMonitoringLogDocument(Document):
    time = fields.DateField()
    operation_site = fields.KeywordField(analyzer=html_strip)
    log_level = fields.KeywordField(analyzer=html_strip)
    message = fields.TextField(analyzer=html_strip)

    class Django:
        model = EssMonitoringLog
