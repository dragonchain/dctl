# Copyright 2020 Dragonchain, Inc.
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

from typing import Tuple, Dict

import flask

from webserver.dragonchain import helpers
from webserver.dragonchain import exceptions
from webserver.dragonchain.lib import smart_contracts


def apply_routes(app: flask.Flask):
    app.add_url_rule("/v1/get/<path:key>", "get_sc_heap_v1", get_sc_heap_v1, methods=["GET"])  # :path allows / in key variable
    app.add_url_rule("/v1/list/<path:prefix_key>", "list_sc_heap_v1", list_sc_heap_v1, methods=["GET"])  # :path allows / in key variable


def get_sc_heap_v1(key: str) -> Tuple[str, int]:
    """
    /v1/get/<contract_id>/HEAP/<key>
    method = GET
    path = '/' seperate string where the left side is the contract_id
            and the right side is the object key in the heap
    Get a value from the smart contract heap in storage
    """
    initial_index = key.find("/")
    if initial_index == -1:
        raise exceptions.BadRequest("Path must look like /v1/get/<contract_id>/<object_key>")
    contract_id = key[:initial_index]
    path = key[initial_index:]
    return (
        smart_contracts.heap_get_v1(contract_id, path),
        200,
    )  # Explicitly not using helpers.flask_http_response, because response isn't necessarily JSON


def list_sc_heap_v1(prefix_key: str) -> Tuple[str, int, Dict[str, str]]:
    """
    /v1/list/<prefix_key>
    method = GET
    path = '/' seperate string where the left side is the contract_id
            and the right side is an optional object key in the heap

            i.e. /v1/list/currency_contract/folder_in_heap (to search the folder_in_heap for a the currency_contract SC)
            i.e. /v1/list/a_contract/ (to list at the root of the heap for the a_contract SC)
    Get an array of keys from the smart contract heap in storage
    List storage keys under a prefix
    """
    initial_index = prefix_key.find("/")
    if initial_index == -1:
        raise exceptions.BadRequest(
            "Path must look like /v1/list/<contract_id>/<object_folder> or /v1/list/<contract_id>/ to search the root of the heap"
        )
    path = prefix_key[initial_index:]
    return helpers.flask_http_response(200, smart_contracts.heap_list_v1(path))
