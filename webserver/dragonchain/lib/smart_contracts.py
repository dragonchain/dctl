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

from typing import List

from webserver.dragonchain import logger
from webserver.dragonchain import disk


_log = logger.get_logger()

sub_folder = '/dragonchain/heap'


def heap_list_v1(prefix: str) -> List[str]:
    listed_keys = disk.list_objects(prefix=prefix)
    key_response = []
    for key in listed_keys:
        key_response.append(key[key.index(sub_folder) + len(sub_folder):])
    return key_response


def heap_get_v1(contract_id: str, path: str) -> str:
    return disk.get(key=path, location=sub_folder).decode("utf-8")
