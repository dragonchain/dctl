# Copyright 2019 Dragonchain, Inc.
# Licensed under the Apache License, Version 2.0 (the "Apache License")
# with the following modification; you may not use this file except in
# compliance with the Apache License and the following modification to it:
# Section 6. Trademarks. is deleted and replaced with:
#      6. Trademarks. This License does not grant permission to use the trade
#         names, trademarks, service marks, or product names of the Licensor
#         and its affiliates, except as required to comply with Section 4(c) of
#         the License and to reproduce the content of the NOTICE file.
# You may obtain a copy of the Apache License at
#     http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the Apache License with the above modification is
# distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the Apache License for the specific
# language governing permissions and limitations under the Apache License.

import flask
from webserver.dragonchain import logger
from webserver.dragonchain.routes import route
_log = logger.get_logger()


def start() -> None:
    """
    Ran by the webserver before it boots
    """
    app = flask.Flask(__name__)
    route(app)
    _log.info("Booting flask")
    app.run(host='0.0.0.0', port=8080)  # blocking
    _log.info('Killing flask.')


if __name__ == "__main__":
    # Wait for Redis and Redisearch to connect before starting initialization
    try:
        start()
    except Exception as e:
        print(e, "Uncaught error in webserver start")
        raise
