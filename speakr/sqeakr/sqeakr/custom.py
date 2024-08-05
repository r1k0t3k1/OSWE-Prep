import jinja2

from django.conf import settings
from django.template import TemplateDoesNotExist, TemplateSyntaxError
from django.utils.functional import cached_property
from django.utils.module_loading import import_string

from django.template.backends.base import BaseEngine

class Custom(BaseEngine):

    app_dirname = 'custom'

    def __init__(self, params):
        params = params.copy()
        options = params.pop('OPTIONS').copy()
        super().__init__(params)

        self.context_processors = options.pop('context_processors', [])

        environment = options.pop('environment', 'jinja2.Environment')
        environment_cls = import_string(environment)

        if 'loader' not in options:
            options['loader'] = jinja2.FileSystemLoader(self.template_dirs)
        options.setdefault('autoescape', True)
        options.setdefault('undefined',
                           jinja2.DebugUndefined if settings.DEBUG else jinja2.Undefined)

        self.env = environment_cls(**options)

    def from_string(self, template_code):
        return Template(self.env.from_string(template_code), self)

    def get_template(self, template_name):
        try:
            return Template(self.env.get_template(template_name), self)
        except jinja2.TemplateNotFound as exc:
            raise TemplateDoesNotExist(exc.name, backend=self) from exc
        except jinja2.TemplateSyntaxError as exc:
            new = TemplateSyntaxError(exc.args)
            raise new from exc

    @cached_property
    def template_context_processors(self):
        return [import_string(path) for path in self.context_processors]



class Template:

    def __init__(self, template, backend):
        self.template = template
        self.backend = backend

    def render(self, context=None, request=None):
        from django.template.backends.utils import csrf_input_lazy, csrf_token_lazy
        if context is None:
            context = {}
        if request is not None:
            context['request'] = request
            context['csrf_input'] = csrf_input_lazy(request)
            context['csrf_token'] = csrf_token_lazy(request)
            for context_processor in self.backend.template_context_processors:
                context.update(context_processor(request))
        return self.template.render(context)
